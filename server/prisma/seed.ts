/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      firstName: 'Eray',
      lastName: 'Aslan',
      email: 'eray.aslan@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      firstName: 'Enes Faruk',
      lastName: 'Meniz',
      email: 'enesfaruk.meniz@example.com',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      firstName: 'Sefa Eren',
      lastName: 'Şahin',
      email: 'sefaeren.sahin@example.com',
    },
  });

  const user4 = await prisma.user.create({
    data: {
      firstName: 'Kadir',
      lastName: 'Mutlu',
      email: 'kadir.mutlu@example.com',
    },
  });

  // Create Books
  const book1 = await prisma.book.create({
    data: {
      title: 'The Hitchhiker\'s Guide to the Galaxy',
      author: 'Douglas Adams',
      isbn: '978-0345391803',
      publishYear: 1979,
      quantity: 3,
      availableQuantity: 3,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'I, Robot',
      author: 'Isaac Asimov',
      isbn: '978-0553382563',
      publishYear: 1950,
      quantity: 2,
      availableQuantity: 2,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '978-0441172719',
      publishYear: 1965,
      quantity: 4,
      availableQuantity: 4,
    },
  });

  const book4 = await prisma.book.create({
    data: {
      title: 'Brave New World',
      author: 'Aldous Huxley',
      isbn: '978-0060850524',
      publishYear: 1932,
      quantity: 3,
      availableQuantity: 3,
    },
  });

  const book5 = await prisma.book.create({
    data: {
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0451524935',
      publishYear: 1949,
      quantity: 3,
      availableQuantity: 3,
    },
  });

  // Create Borrowing Records
  await prisma.borrowingRecord.create({
    data: {
      userId: user2.id, 
      bookId: book1.id,
      borrowDate: new Date('2024-02-01'),
      returnDate: new Date('2024-02-15'),
      rating: 4.50,
    },
  });

  await prisma.borrowingRecord.create({
    data: {
      userId: user1.id, 
      bookId: book2.id,
      borrowDate: new Date('2024-02-10'),
      returnDate: null,
    },
  });

  await prisma.borrowingRecord.create({
    data: {
      userId: user4.id,
      bookId: book3.id,
      borrowDate: new Date('2024-01-15'),
      returnDate: new Date('2024-01-30'),
      rating: 5.00,
    },
  });

  await prisma.borrowingRecord.create({
    data: {
      userId: user3.id,
      bookId: book4.id,
      borrowDate: new Date('2024-03-01'),
      returnDate: new Date('2024-03-15'),
      rating: 4.00,
    },
  });

  
  await prisma.book.update({
    where: { id: book2.id },
    data: { availableQuantity: 1 },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 