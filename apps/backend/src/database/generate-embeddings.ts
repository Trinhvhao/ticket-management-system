import { Sequelize } from 'sequelize-typescript';
import { KnowledgeArticle } from './entities/knowledge-article.entity';
import { Category } from './entities/category.entity';
import { User } from './entities/user.entity';
import { Ticket } from './entities/ticket.entity';
import { Comment } from './entities/comment.entity';
import { Attachment } from './entities/attachment.entity';
import { EmbeddingService } from '../common/services/embedding.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function generateEmbeddings() {
  console.log('🚀 Starting embedding generation...\n');

  // Initialize Sequelize
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432'),
    username: process.env['DB_USER'] || 'postgres',
    password: process.env['DB_PASS'] || '',
    database: process.env['DB_NAME'] || 'postgres',
    dialectOptions: {
      ssl: process.env['DB_SSL'] === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    models: [User, KnowledgeArticle, Category, Ticket, Comment, Attachment],
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    // Initialize embedding service
    const embeddingService = new EmbeddingService();
    await embeddingService.onModuleInit();

    // Wait for model to load
    console.log('⏳ Waiting for embedding model to load...');
    let retries = 0;
    while (!embeddingService.isReady() && retries < 30) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      retries++;
    }

    if (!embeddingService.isReady()) {
      throw new Error('Embedding service failed to initialize');
    }

    console.log('✅ Embedding model loaded\n');

    // Get all published articles without embeddings
    const articles = await KnowledgeArticle.findAll({
      where: {
        isPublished: true,
      },
      include: [Category],
    });

    console.log(`📚 Found ${articles.length} published articles\n`);

    if (articles.length === 0) {
      console.log('⚠️  No articles found. Please seed knowledge base first.');
      process.exit(0);
    }

    // Generate embeddings for each article
    let processed = 0;
    let updated = 0;
    let skipped = 0;

    for (const article of articles) {
      processed++;
      
      // Skip if already has embedding
      if (article.embedding) {
        console.log(`⏭️  [${processed}/${articles.length}] Skipping "${article.title}" (already has embedding)`);
        skipped++;
        continue;
      }

      console.log(`🔄 [${processed}/${articles.length}] Processing: "${article.title}"`);

      try {
        // Combine title and content for better semantic search
        const textToEmbed = `${article.title}\n\n${article.content}`;

        // Generate embedding
        const startTime = Date.now();
        const embedding = await embeddingService.generateEmbedding(textToEmbed);
        const duration = Date.now() - startTime;

        // Save to database
        article.embedding = JSON.stringify(embedding);
        await article.save();

        console.log(`   ✅ Generated embedding (${embedding.length} dims) in ${duration}ms`);
        updated++;
      } catch (error) {
        console.error(`   ❌ Error processing article ${article.id}:`, error);
      }

      console.log('');
    }

    console.log('\n📊 Summary:');
    console.log(`   Total articles: ${articles.length}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Failed: ${processed - updated - skipped}`);

    console.log('\n✅ Embedding generation completed!');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    await sequelize.close();
    process.exit(1);
  }
}

generateEmbeddings();
