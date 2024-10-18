import { connectToDB, disconnectFromDB } from '../src/utils/mongoMemoryServer';
import { User, Case, Franchise, FloorPlan, SubscriptionPlan } from '../src/utils/dbSchema';
import { hashPassword } from '../src/utils/auth';

async function buildDatabase() {
  try {
    await connectToDB();
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Case.deleteMany({});
    await Franchise.deleteMany({});
    await FloorPlan.deleteMany({});
    await SubscriptionPlan.deleteMany({});

    // Create a super admin
    const superAdminPassword = await hashPassword('superadmin123');
    const superAdmin = new User({
      email: 'superadmin@example.com',
      password: superAdminPassword,
      role: 'superadmin',
      firstName: 'Super',
      lastName: 'Admin'
    });
    await superAdmin.save();

    // Create a franchise
    const franchise = new Franchise({
      name: 'Sample Franchise',
      subscriptionStatus: 'active',
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      paymentMethod: 'credit_card'
    });
    await franchise.save();

    // Create an admin for the franchise
    const adminPassword = await hashPassword('admin123');
    const admin = new User({
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      franchise: franchise._id
    });
    await admin.save();

    // Create a floor plan
    const floorPlan = new FloorPlan({
      name: 'Main Floor',
      imageUrl: 'https://example.com/floor-plan.jpg',
      franchise: franchise._id
    });
    await floorPlan.save();

    // Create a case
    const case1 = new Case({
      title: 'Sample Incident',
      description: 'This is a sample incident for testing purposes.',
      status: 'open',
      createdAt: new Date(),
      assignedTo: admin._id,
      franchise: franchise._id,
      floorPlan: floorPlan._id,
      incidentLocation: { x: 0.5, y: 0.5 }
    });
    await case1.save();

    // Create a subscription plan
    const subscriptionPlan = new SubscriptionPlan({
      name: 'Basic Plan',
      description: 'Basic features for small franchises',
      price: 99.99,
      features: ['Case Management', 'User Management', 'Basic Reporting']
    });
    await subscriptionPlan.save();

    console.log('Database built successfully');
  } catch (error) {
    console.error('Error building database:', error);
  } finally {
    await disconnectFromDB();
  }
}

buildDatabase();