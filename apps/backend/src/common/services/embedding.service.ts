import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { pipeline } from '@xenova/transformers';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(EmbeddingService.name);
  private embedder: any = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  async onModuleInit() {
    this.logger.log('Initializing Embedding Service...');
    this.initializationPromise = this.initializeEmbedder();
  }

  private async initializeEmbedder(): Promise<void> {
    try {
      this.logger.log('Loading embedding model: Xenova/all-MiniLM-L6-v2...');
      
      // Load the model (will download on first run, ~80MB)
      this.embedder = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
        {
          quantized: true, // Use quantized version for faster inference
        }
      );

      this.isInitialized = true;
      this.logger.log('✅ Embedding model loaded successfully!');
    } catch (error) {
      this.logger.error('❌ Failed to load embedding model:', error);
      throw error;
    }
  }

  /**
   * Ensure the embedder is initialized before use
   */
  private async ensureInitialized(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      await this.initializationPromise;
    } else {
      await this.initializeEmbedder();
    }
  }

  /**
   * Generate embedding for a single text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    await this.ensureInitialized();

    if (!this.embedder) {
      throw new Error('Embedder not initialized');
    }

    try {
      // Generate embedding
      const output = await this.embedder(text, {
        pooling: 'mean',
        normalize: true,
      });

      // Convert to array
      const embedding = Array.from(output.data) as number[];

      this.logger.debug(`Generated embedding for text (${text.length} chars) → ${embedding.length} dimensions`);

      return embedding;
    } catch (error) {
      this.logger.error('Error generating embedding:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts (batch)
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    await this.ensureInitialized();

    if (!this.embedder) {
      throw new Error('Embedder not initialized');
    }

    try {
      this.logger.log(`Generating embeddings for ${texts.length} texts...`);

      const embeddings: number[][] = [];

      // Process in batches to avoid memory issues
      const batchSize = 10;
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        
        for (const text of batch) {
          const embedding = await this.generateEmbedding(text);
          embeddings.push(embedding);
        }

        this.logger.debug(`Processed ${Math.min(i + batchSize, texts.length)}/${texts.length} texts`);
      }

      this.logger.log(`✅ Generated ${embeddings.length} embeddings`);

      return embeddings;
    } catch (error) {
      this.logger.error('Error generating embeddings:', error);
      throw error;
    }
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  cosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimension');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      const val1 = embedding1[i] || 0;
      const val2 = embedding2[i] || 0;
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    }

    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));

    return similarity;
  }

  /**
   * Find most similar embeddings
   */
  findMostSimilar(
    queryEmbedding: number[],
    candidateEmbeddings: number[][],
    topK: number = 5,
  ): Array<{ index: number; similarity: number }> {
    const similarities = candidateEmbeddings.map((embedding, index) => ({
      index,
      similarity: this.cosineSimilarity(queryEmbedding, embedding),
    }));

    // Sort by similarity (descending)
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Return top K
    return similarities.slice(0, topK);
  }

  /**
   * Get embedding dimension
   */
  getEmbeddingDimension(): number {
    return 384; // all-MiniLM-L6-v2 produces 384-dimensional embeddings
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}
