import Resource, { IResource } from './models/Resource';

const initialData: Partial<IResource>[] = [
  { name: 'Premium API Access', description: 'Full access to premium API endpoints with unlimited requests', value: 2500 },
  { name: 'Database Storage', description: 'Cloud database storage with 500GB capacity', value: 1200 },
  { name: 'SSL Certificate', description: 'Extended validation SSL certificate for secure connections', value: 450 },
  { name: 'CDN Bandwidth', description: 'Content delivery network with 1TB monthly bandwidth', value: 800 },
  { name: 'Backup Service', description: 'Automated daily backups with 30-day retention', value: 350 },
  { name: 'Monitoring Tools', description: 'Real-time application monitoring and alerting system', value: 600 },
  { name: 'Load Balancer', description: 'High-availability load balancing service', value: 1500 },
  { name: 'Cache Layer', description: 'Redis cache with 10GB memory allocation', value: 550 },
  { name: 'Email Service', description: 'Transactional email service with 50,000 emails/month', value: 300 },
  { name: 'Analytics Dashboard', description: 'Advanced analytics and reporting dashboard', value: 950 }
];

export const seedData = async (): Promise<void> => {
  try {
    const count = await Resource.countDocuments();
    if (count === 0) {
      await Resource.insertMany(initialData);
      console.log('Seed data inserted successfully');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};