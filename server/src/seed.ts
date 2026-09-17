import { PrismaClient, OrderStatus, PaymentMethod, PaymentStatus, TrackingStep, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase(cleanExisting = true) {
  if (cleanExisting) {
    console.log('🌱 Cleaning existing data in farmer_inventory_system...');
    await prisma.notification.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.orderFeedback.deleteMany();
    await prisma.orderExtension.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.farmer.deleteMany();
    await prisma.customer.deleteMany();
  }

  const hashedPw = await bcrypt.hash('password123', 10);

  console.log('👩‍🌾 Seeding Farmers...');
  const farmerGurpreet = await prisma.farmer.create({
    data: {
      full_name: 'Gurpreet Singh',
      username: 'gurpreet_punjab',
      password_hash: hashedPw,
      contact_number: '+91 98765 43210',
      farm_location: 'Ludhiana, Punjab',
    },
  });

  const farmerAnita = await prisma.farmer.create({
    data: {
      full_name: 'Anita Sharma',
      username: 'anita_himachal',
      password_hash: hashedPw,
      contact_number: '+91 98123 45678',
      farm_location: 'Shimla, Himachal Pradesh',
    },
  });

  const farmerRamesh = await prisma.farmer.create({
    data: {
      full_name: 'Ramesh Patel',
      username: 'ramesh_gujarat',
      password_hash: hashedPw,
      contact_number: '+91 97234 56789',
      farm_location: 'Anand, Gujarat',
    },
  });

  console.log('🛒 Seeding Customers...');
  const customerRahul = await prisma.customer.create({
    data: {
      customer_name: 'Rahul Verma',
      username: 'rahul_v',
      password_hash: hashedPw,
      contact_number: '+91 99111 22233',
      address: 'Flat 402, Green Park Avenue, New Delhi',
    },
  });

  const customerPriya = await prisma.customer.create({
    data: {
      customer_name: 'Priya Nair',
      username: 'priya_n',
      password_hash: hashedPw,
      contact_number: '+91 98888 77766',
      address: 'House 12, Indiranagar, Bengaluru, Karnataka',
    },
  });

  console.log('🍎 Seeding Products...');
  const p1 = await prisma.product.create({
    data: {
      farmer_id: farmerGurpreet.farmer_id,
      product_name: 'Organic Sharbati Wheat',
      category: 'Grains',
      stock_quantity: 150,
      unit: 'kg',
      price_per_unit: 28.5,
      low_stock_threshold: 20,
      image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    },
  });

  const p2 = await prisma.product.create({
    data: {
      farmer_id: farmerGurpreet.farmer_id,
      product_name: 'Fresh Farm Mustard Honey',
      category: 'Honey & Sweeteners',
      stock_quantity: 3, // LOW STOCK TRIGGER!
      unit: 'kg',
      price_per_unit: 340.0,
      low_stock_threshold: 5,
      image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    },
  });

  const p3 = await prisma.product.create({
    data: {
      farmer_id: farmerGurpreet.farmer_id,
      product_name: 'Vine-Ripened Organic Tomatoes',
      category: 'Vegetables',
      stock_quantity: 65,
      unit: 'kg',
      price_per_unit: 32.0,
      low_stock_threshold: 10,
      image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    },
  });

  const p4 = await prisma.product.create({
    data: {
      farmer_id: farmerAnita.farmer_id,
      product_name: 'Royal Delicious Mountain Apples',
      category: 'Fruits',
      stock_quantity: 4, // LOW STOCK TRIGGER!
      unit: 'kg',
      price_per_unit: 110.0,
      low_stock_threshold: 6,
      image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    },
  });

  const p5 = await prisma.product.create({
    data: {
      farmer_id: farmerAnita.farmer_id,
      product_name: 'Crisp Green Mountain Capsicum',
      category: 'Vegetables',
      stock_quantity: 45,
      unit: 'kg',
      price_per_unit: 45.0,
      low_stock_threshold: 8,
      image_url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
    },
  });

  const p6 = await prisma.product.create({
    data: {
      farmer_id: farmerRamesh.farmer_id,
      product_name: 'Pure Desi Gir Cow A2 Ghee',
      category: 'Dairy',
      stock_quantity: 2, // LOW STOCK TRIGGER!
      unit: 'jar (500ml)',
      price_per_unit: 550.0,
      low_stock_threshold: 4,
      image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    },
  });

  console.log('📦 Seeding Orders & Extensions...');
  // Order 1: Accepted order with review and tracking
  const order1 = await prisma.order.create({
    data: {
      customer_id: customerRahul.customer_id,
      farmer_id: farmerGurpreet.farmer_id,
      product_id: p1.product_id,
      quantity: 10,
      status: OrderStatus.ACCEPTED,
      requested_at: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      responded_at: new Date(Date.now() - 3 * 24 * 3600 * 1000 + 3600 * 1000),
      extension: {
        create: {
          payment_method: PaymentMethod.ONLINE,
          payment_status: PaymentStatus.COMPLETED,
          delivery_pincode: '110016',
          delivery_fee: 50.0,
          delivery_address: 'Flat 402, Green Park Avenue, New Delhi',
          tracking_step: TrackingStep.DELIVERED,
          estimated_delivery: 'Delivered safely',
        },
      },
    },
  });

  // Sale record for accepted order 1
  await prisma.sale.create({
    data: {
      product_id: p1.product_id,
      customer_id: customerRahul.customer_id,
      farmer_id: farmerGurpreet.farmer_id,
      quantity_sold: 10,
      total_amount: 285.0,
      sale_date: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    },
  });

  // Review for Order 1
  await prisma.orderFeedback.create({
    data: {
      order_id: order1.order_id,
      customer_id: customerRahul.customer_id,
      farmer_id: farmerGurpreet.farmer_id,
      product_id: p1.product_id,
      rating: 5,
      comment: 'Exceptional quality wheat! The rotis were soft and fragrant. Delivered straight from Punjab.',
    },
  });

  // Order 2: Pending order in farmer's inbox (ready to accept/reject in Kanban!)
  await prisma.order.create({
    data: {
      customer_id: customerRahul.customer_id,
      farmer_id: farmerGurpreet.farmer_id,
      product_id: p3.product_id,
      quantity: 5,
      status: OrderStatus.PENDING,
      requested_at: new Date(Date.now() - 2 * 3600 * 1000),
      extension: {
        create: {
          payment_method: PaymentMethod.COD,
          payment_status: PaymentStatus.PENDING,
          delivery_pincode: '110016',
          delivery_fee: 50.0,
          delivery_address: 'Flat 402, Green Park Avenue, New Delhi',
          tracking_step: TrackingStep.PLACED,
          estimated_delivery: '1-2 days',
        },
      },
    },
  });

  // Order 3: Pending order for honey
  await prisma.order.create({
    data: {
      customer_id: customerPriya.customer_id,
      farmer_id: farmerGurpreet.farmer_id,
      product_id: p2.product_id,
      quantity: 1,
      status: OrderStatus.PENDING,
      requested_at: new Date(Date.now() - 1 * 3600 * 1000),
      extension: {
        create: {
          payment_method: PaymentMethod.ONLINE,
          payment_status: PaymentStatus.COMPLETED,
          delivery_pincode: '560038',
          delivery_fee: 110.0,
          delivery_address: 'House 12, Indiranagar, Bengaluru, Karnataka',
          tracking_step: TrackingStep.PLACED,
          estimated_delivery: '2-4 days',
        },
      },
    },
  });

  // Historical sales for rich chart trends
  const pastDays = [12, 10, 8, 7, 5, 4, 2, 1];
  for (const day of pastDays) {
    await prisma.sale.create({
      data: {
        product_id: p1.product_id,
        customer_id: customerRahul.customer_id,
        farmer_id: farmerGurpreet.farmer_id,
        quantity_sold: Math.floor(Math.random() * 15) + 5,
        total_amount: Math.floor(Math.random() * 800) + 300,
        sale_date: new Date(Date.now() - day * 24 * 3600 * 1000),
      },
    });
  }

  console.log('💬 Seeding Chat Messages...');
  await prisma.chatMessage.create({
    data: {
      farmer_id: farmerGurpreet.farmer_id,
      customer_id: customerRahul.customer_id,
      sender_role: UserRole.CUSTOMER,
      message_text: 'Hello Gurpreet ji! Is the Sharbati wheat 100% naturally harvested without chemicals?',
      is_read: true,
      created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000),
    },
  });

  await prisma.chatMessage.create({
    data: {
      farmer_id: farmerGurpreet.farmer_id,
      customer_id: customerRahul.customer_id,
      sender_role: UserRole.FARMER,
      message_text: 'Sat Sri Akal Rahul ji! Yes, we only use traditional cow-dung compost and neem-based natural spray. 100% pure.',
      is_read: true,
      created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000 + 1800 * 1000),
    },
  });

  console.log('🔔 Seeding Notifications...');
  await prisma.notification.create({
    data: {
      farmer_id: farmerGurpreet.farmer_id,
      product_id: p2.product_id,
      title: 'Low Stock Alert: Fresh Farm Mustard Honey',
      message: 'Honey stock has dropped to 3 kg (Low-stock threshold: 5 kg). Refill soon to avoid missed sales.',
      type: 'LOW_STOCK',
      is_read: false,
    },
  });

  console.log('✅ Seeding completed successfully!');
}

if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error('❌ Seeding error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
