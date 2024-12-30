-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "paymentId" TEXT;

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "expiryYear" INTEGER NOT NULL,
    "expiryMonth" INTEGER NOT NULL,
    "last4Digits" TEXT NOT NULL,
    "stripePaymentMethodId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" TEXT,
    "additionalInfo" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_stripePaymentMethodId_key" ON "PaymentMethod"("stripePaymentMethodId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
