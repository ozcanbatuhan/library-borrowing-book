import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
    },
  });

  // Create Books
  const book1 = await prisma.book.create({
    data: {
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0451524935',
      publishYear: 1949,
      quantity: 3,
      availableQuantity: 3,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0446310789',
      publishYear: 1960,
      quantity: 2,
      availableQuantity: 2,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      publishYear: 1925,
      quantity: 4,
      availableQuantity: 4,
    },
  });

  // Create Borrowing Records
  await prisma.borrowingRecord.create({
    data: {
      userId: user1.id,
      bookId: book1.id,
      borrowDate: new Date('2024-02-01'),
      returnDate: new Date('2024-02-15'),
      rating: 5,
    },
  });

  await prisma.borrowingRecord.create({
    data: {
      userId: user2.id,
      bookId: book2.id,
      borrowDate: new Date('2024-02-10'),
      returnDate: null,
    },
  });

  await prisma.borrowingRecord.create({
    data: {
      userId: user1.id,
      bookId: book3.id,
      borrowDate: new Date('2024-01-15'),
      returnDate: new Date('2024-01-30'),
      rating: 4,
    },
  });

  // Update available quantities
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