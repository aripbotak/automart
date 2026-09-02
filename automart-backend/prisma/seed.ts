import { PrismaClient, Role, VehicleCondition, TransmissionType, FuelType, BodyType, Drivetrain, VehicleStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for AutoMart...');

  // Clean existing tables
  await prisma.inquiry.deleteMany();
  await prisma.vehicleImage.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@automart.com',
      password: passwordHash,
      role: Role.ADMIN,
      phone: '+1 (555) 000-1122',
      city: 'New York',
      state: 'NY',
    },
  });

  const dealerUser = await prisma.user.create({
    data: {
      name: 'Apex Motor Gallery',
      email: 'dealer@apexmotors.com',
      password: passwordHash,
      role: Role.DEALER,
      companyName: 'Apex Motor Gallery Group LLC',
      isVerifiedDealer: true,
      phone: '+1 (555) 234-8901',
      city: 'Los Angeles',
      state: 'CA',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    },
  });

  const buyerUser = await prisma.user.create({
    data: {
      name: 'Alexander Wright',
      email: 'buyer@example.com',
      password: passwordHash,
      role: Role.BUYER,
      phone: '+1 (555) 876-5432',
      city: 'San Francisco',
      state: 'CA',
    },
  });

  // 2. Create Sample Vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      title: '2024 Porsche 911 Carrera GTS',
      brand: 'Porsche',
      model: '911 Carrera GTS',
      year: 2024,
      price: 158200,
      originalPrice: 165000,
      mileage: 1850,
      transmission: TransmissionType.DUAL_CLUTCH,
      fuelType: FuelType.PETROL,
      bodyType: BodyType.COUPE,
      condition: VehicleCondition.BRAND_NEW,
      engine: '3.0L Twin-Turbo Flat-6',
      horsepower: 473,
      drivetrain: Drivetrain.RWD,
      exteriorColor: 'Chalk White',
      interiorColor: 'Black / Carmine Red Leather',
      vin: 'WP0AB2A98RS102948',
      description:
        'The 2024 Porsche 911 Carrera GTS blends extreme racetrack dynamics with exceptional daily livability. Equipped with Sport Chrono Package and PASM sport suspension.',
      features: [
        'Sport Chrono Package',
        'PASM Sport Suspension',
        'Burmester High-End Surround Sound',
        'Adaptive 18-Way Sport Seats Plus',
        'Carbon Fiber Interior Package',
      ],
      featured: true,
      status: VehicleStatus.AVAILABLE,
      sellerId: dealerUser.id,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1400&q=80',
            isPrimary: true,
            caption: 'Front 3/4 Angle',
            order: 1,
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
            isPrimary: false,
            caption: 'Rear Aerodynamic Profile',
            order: 2,
          },
        ],
      },
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      title: '2023 Tesla Model S Plaid AWD',
      brand: 'Tesla',
      model: 'Model S Plaid',
      year: 2023,
      price: 89990,
      originalPrice: 94000,
      mileage: 8200,
      transmission: TransmissionType.AUTOMATIC,
      fuelType: FuelType.ELECTRIC,
      bodyType: BodyType.SEDAN,
      condition: VehicleCondition.CERTIFIED_PRE_OWNED,
      engine: 'Tri-Motor Electric All-Wheel Drive',
      horsepower: 1020,
      drivetrain: Drivetrain.AWD,
      exteriorColor: 'Deep Blue Metallic',
      interiorColor: 'Cream Premium Interior',
      vin: '5YJSA1E67PF992811',
      description:
        'Tri-motor powertrain with torque vectoring capable of 0-60 mph in 1.99s. Full Self-Driving hardware included.',
      features: [
        'Full Self-Driving (FSD) Hardware 4.0',
        'Tri-Motor AWD 1,020 hp',
        'Yoke Steering Wheel',
        '22-Speaker 960W Audio System',
      ],
      featured: true,
      status: VehicleStatus.AVAILABLE,
      sellerId: dealerUser.id,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1400&q=80',
            isPrimary: true,
            caption: 'Exterior Front View',
            order: 1,
          },
        ],
      },
    },
  });

  // 3. Create Sample Inquiry
  await prisma.inquiry.create({
    data: {
      vehicleId: vehicle1.id,
      userId: buyerUser.id,
      name: buyerUser.name,
      email: buyerUser.email,
      phone: buyerUser.phone || '+15558765432',
      message: 'Hi, I would like to schedule a VIP test drive this Saturday.',
      requestTestDrive: true,
      tradeInInterest: true,
    },
  });

  console.log('✅ Seed completed successfully with demo Users, Vehicles, Images and Inquiries!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
