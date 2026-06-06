import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Reset database tables in order of dependency
  await prisma.report.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.purchaseOrder.deleteMany({});
  await prisma.quotation.deleteMany({});
  await prisma.rfq.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.vendor.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create System Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@vendorbridge.com',
      password: passwordHash,
      name: 'System Admin',
      role: 'ADMIN',
    },
  });

  // 2. Create Procurement Manager
  const procurement = await prisma.user.create({
    data: {
      email: 'procurement@vendorbridge.com',
      password: passwordHash,
      name: 'Procurement Manager',
      role: 'PROCUREMENT_MANAGER',
    },
  });

  // 3. Create Buyer Agent
  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@vendorbridge.com',
      password: passwordHash,
      name: 'Buyer Agent',
      role: 'BUYER',
    },
  });

  // 4. Create Vendor 1: Acme Supplies Group
  const acme = await prisma.vendor.create({
    data: {
      name: 'Acme Supplies Group',
      email: 'contact@acmesupplies.com',
      phone: '+15550199',
      address: '100 Acme Way, Industrial Zone, TX',
      registrationNumber: 'REG-884920-X',
      status: 'APPROVED',
    },
  });

  // Create User for Acme
  const acmeUser = await prisma.user.create({
    data: {
      email: 'sales@acmesupplies.com',
      password: passwordHash,
      name: 'Alice Johnson',
      role: 'SUPPLIER',
      vendorId: acme.id,
    },
  });

  // 5. Create Vendor 2: TechParts Corp
  const techparts = await prisma.vendor.create({
    data: {
      name: 'TechParts Corp',
      email: 'sales@techparts.com',
      phone: '+15550144',
      address: '404 Silicon Boulevard, Tech District, CA',
      registrationNumber: 'REG-331049-T',
      status: 'APPROVED',
    },
  });

  // Create User for TechParts
  const techpartsUser = await prisma.user.create({
    data: {
      email: 'sales@techparts.com',
      password: passwordHash,
      name: 'Bob Miller',
      role: 'SUPPLIER',
      vendorId: techparts.id,
    },
  });

  // 6. Create Vendor 3: Global Office Co
  const officeco = await prisma.vendor.create({
    data: {
      name: 'Global Office Co',
      email: 'info@globaloffice.com',
      phone: '+15550177',
      address: '77 Stationery Road, Logistics Park, IL',
      registrationNumber: 'REG-556102-G',
      status: 'APPROVED',
    },
  });

  // Create User for Global Office Co
  const officecoUser = await prisma.user.create({
    data: {
      email: 'sales@globaloffice.com',
      password: passwordHash,
      name: 'Claire Davis',
      role: 'SUPPLIER',
      vendorId: officeco.id,
    },
  });

  // 7. Create RFQs (created by Procurement Manager or Buyer)
  const rfq1 = await prisma.rfq.create({
    data: {
      title: 'Laptop Procurement 2026',
      description: 'Procurement of 50 enterprise-grade laptops for engineering team. Needs 32GB RAM, 1TB SSD.',
      deadline: new Date('2026-06-30T18:30:00.000Z'),
      status: 'PUBLISHED',
      createdById: procurement.id,
    },
  });

  const rfq2 = await prisma.rfq.create({
    data: {
      title: 'Office Stationery Supply',
      description: 'Annual contract for supply of custom notebooks, pens, markers, and print paper.',
      deadline: new Date('2026-06-25T18:30:00.000Z'),
      status: 'PUBLISHED',
      createdById: procurement.id,
    },
  });

  const rfq3 = await prisma.rfq.create({
    data: {
      title: 'High-Speed Server Infrastructure',
      description: 'Hosting infrastructure renewal. Querying quotes for 5 dedicated GPU instances.',
      deadline: new Date('2026-07-15T18:30:00.000Z'),
      status: 'PUBLISHED',
      createdById: buyer.id,
    },
  });

  const rfq4 = await prisma.rfq.create({
    data: {
      title: 'Logistics and Shipping Services',
      description: 'Request for quotes for freight forwarders and local courier delivery services.',
      deadline: new Date('2026-07-20T18:30:00.000Z'),
      status: 'DRAFT',
      createdById: procurement.id,
    },
  });

  // 8. Create Quotations submitted by Vendors
  // Quotation 1 on Laptop Procurement by TechParts
  const quote1 = await prisma.quotation.create({
    data: {
      rfqId: rfq1.id,
      vendorId: techparts.id,
      price: 4500000.00, // ₹45L
      deliveryTimeline: '15 Days',
      comments: 'Offering Lenovo ThinkPad P1 Gen 6 with 3-year warranty support.',
      status: 'UNDER_REVIEW',
    },
  });

  // Quotation 2 on Office Stationery by Acme Supplies
  const quote2 = await prisma.quotation.create({
    data: {
      rfqId: rfq2.id,
      vendorId: acme.id,
      price: 85000.00, // ₹85,000
      deliveryTimeline: '5 Days',
      comments: 'Full catalog delivery. Free custom embossing included on bulk notebook orders.',
      status: 'ACCEPTED',
    },
  });

  // Quotation 3 on Office Stationery by Global Office Co
  const quote3 = await prisma.quotation.create({
    data: {
      rfqId: rfq2.id,
      vendorId: officeco.id,
      price: 92000.00, // ₹92,000
      deliveryTimeline: '7 Days',
      comments: 'Includes 10% discount on first-time orders.',
      status: 'REJECTED',
    },
  });

  // 9. Create Purchase Orders
  // PO-001: Acme Supplies Group (Accepted/Delivered)
  await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-001',
      quotationId: quote2.id,
      vendorId: acme.id,
      buyerId: procurement.id,
      totalAmount: 85000.00,
      status: 'ACCEPTED',
    },
  });

  // PO-002: TechParts Corp (Draft/Pending Approval)
  // We link to TechParts' laptop quote which is under review (represented as Draft PO)
  await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-002',
      quotationId: quote1.id,
      vendorId: techparts.id,
      buyerId: buyer.id,
      totalAmount: 4500000.00,
      status: 'DRAFT',
    },
  });

  // 10. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        title: 'RFQ Deadline Approaching',
        description: 'The deadline for laptop procurement RFQ is in 3 days.',
        userId: procurement.id,
        read: false,
      },
      {
        title: 'New Quotation Received',
        description: 'TechParts Corp submitted a bid of ₹45,000 for Laptop Procurement.',
        userId: procurement.id,
        read: false,
      },
      {
        title: 'Approval Request Assigned',
        description: 'New vendor selection request is pending your authorization level 1.',
        userId: procurement.id,
        read: false,
      },
      {
        title: 'Invoice Generated',
        description: 'Invoice INV-2026-101 has been generated from PO-2026-001.',
        userId: procurement.id,
        read: true,
      },
    ],
  });

  // 11. Seed AuditLogs
  await prisma.auditLog.createMany({
    data: [
      {
        logId: 'LOG-001',
        user: 'Mohammad Ali',
        module: 'RFQ',
        action: 'Created RFQ',
        entity: 'Laptop Procurement 2026',
        status: 'Success',
        ipAddress: '192.168.1.10',
      },
      {
        logId: 'LOG-002',
        user: 'Alice Johnson',
        module: 'Quotation',
        action: 'Submitted Quotation',
        entity: 'Office Stationery Quote',
        status: 'Success',
        ipAddress: '192.168.1.12',
      },
      {
        logId: 'LOG-003',
        user: 'Procurement Manager',
        module: 'Approval',
        action: 'Approved Quotation',
        entity: 'Office Stationery Quote Selection',
        status: 'Success',
        ipAddress: '192.168.1.15',
      },
      {
        logId: 'LOG-004',
        user: 'Procurement Manager',
        module: 'PO',
        action: 'Generated PO',
        entity: 'PO-2026-001 for Acme Supplies',
        status: 'Success',
        ipAddress: '192.168.1.15',
      },
    ],
  });

  // 12. Seed Reports
  await prisma.report.createMany({
    data: [
      {
        name: 'Vendor Performance Q2',
        generatedBy: 'Procurement Manager',
        format: 'PDF',
        status: 'COMPLETED',
        url: '/exports/vendor-perf-q2.pdf',
        filters: JSON.stringify({ category: 'IT Hardware' }),
      },
      {
        name: 'Annual Spend Analysis 2026',
        generatedBy: 'Mohammad Ali',
        format: 'Excel',
        status: 'COMPLETED',
        url: '/exports/spend-analysis-2026.xlsx',
        filters: JSON.stringify({ dateRange: 'Yearly' }),
      },
      {
        name: 'Pending Invoices Audit',
        generatedBy: 'Buyer Agent',
        format: 'CSV',
        status: 'COMPLETED',
        url: '/exports/pending-invoices.csv',
        filters: JSON.stringify({ status: 'PENDING' }),
      },
    ],
  });

  console.log('Seeding completed successfully:');
  console.log({
    admin: admin.email,
    procurement: procurement.email,
    buyer: buyer.email,
    acmeUser: acmeUser.email,
    techpartsUser: techpartsUser.email,
    officecoUser: officecoUser.email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });