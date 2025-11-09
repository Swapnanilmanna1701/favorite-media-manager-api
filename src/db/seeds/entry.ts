import { db } from '@/db';
import { entry } from '@/db/schema';

async function main() {
    const sampleEntries = [
        {
            title: 'The Shawshank Redemption',
            type: 'Movie',
            director: 'Frank Darabont',
            budget: 25000000,
            location: 'Ohio, USA',
            duration: '142 min',
            year: 1994,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Inception',
            type: 'Movie',
            director: 'Christopher Nolan',
            budget: 160000000,
            location: 'Los Angeles, USA',
            duration: '148 min',
            year: 2010,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Breaking Bad',
            type: 'TV Show',
            director: 'Vince Gilligan',
            budget: 3000000,
            location: 'Albuquerque, USA',
            duration: '47 min per episode',
            year: 2008,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Stranger Things',
            type: 'TV Show',
            director: 'The Duffer Brothers',
            budget: 8000000,
            location: 'Atlanta, USA',
            duration: '50 min per episode',
            year: 2016,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(entry).values(sampleEntries);
    
    console.log('✅ Entry seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});