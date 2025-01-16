-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "BusinessRegistrationFee" AS ENUM ('ONE_YEAR', 'THREE_YEARS');

-- CreateEnum
CREATE TYPE "type" AS ENUM ('admin', 'account_user', 'guest');

-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('started', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "PersonOrCompanyType" AS ENUM ('PERSON', 'COMPANY');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('incorporation');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "type" "type" NOT NULL DEFAULT 'guest',
    "email" VARCHAR(320) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "nameChinese" TEXT NOT NULL,
    "type" "CompanyType" NOT NULL,
    "code" TEXT NOT NULL,
    "natureOfBusiness" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "fax" TEXT,
    "addressId" INTEGER NOT NULL,
    "logo" TEXT,
    "businessFee" "BusinessRegistrationFee" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "presentorReferenceId" INTEGER NOT NULL,
    "status" "CompanyStatus" NOT NULL DEFAULT 'started',
    "projectType" "ProjectType" NOT NULL DEFAULT 'incorporation',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedBy" TEXT,
    "completeDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "flatFloor" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presentorReferences" (
    "id" SERIAL NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "nameChinese" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "fax" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "presentorsReferance" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "presentorReferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shareCapital" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "totalProposed" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "paid" INTEGER NOT NULL,
    "unpaid" INTEGER NOT NULL,
    "rightsAttached" TEXT NOT NULL DEFAULT 'Voting Rights',

    CONSTRAINT "shareCapital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shareholders" (
    "id" SERIAL NOT NULL,
    "type" "PersonOrCompanyType" NOT NULL,
    "idNo" TEXT NOT NULL,
    "idProof" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressProof" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "sharesDetails" JSONB NOT NULL,
    "companyId" INTEGER NOT NULL,
    "NNC1Url" TEXT,

    CONSTRAINT "shareholders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shareholderInvites" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sharesDetails" JSONB NOT NULL,
    "otp" TEXT NOT NULL,
    "linkExpiry" TIMESTAMP(3) NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "invitedByUserId" TEXT NOT NULL,
    "shareholderId" INTEGER,
    "companyId" INTEGER NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shareholderInvites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directors" (
    "id" SERIAL NOT NULL,
    "type" "PersonOrCompanyType" NOT NULL,
    "idNo" TEXT NOT NULL,
    "idProof" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressProof" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "NNC1Url" TEXT,

    CONSTRAINT "directors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directorInvites" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "linkExpiry" TIMESTAMP(3) NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "invitedByUserId" TEXT NOT NULL,
    "directorId" INTEGER,
    "companyId" INTEGER NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "directorInvites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companySecretaries" (
    "id" SERIAL NOT NULL,
    "tcspLicenseNo" TEXT NOT NULL,
    "tcspReason" TEXT NOT NULL,
    "type" "PersonOrCompanyType" NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "idNo" TEXT NOT NULL,
    "idProof" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressProof" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "NNC1Url" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companySecretaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "natureOfBusiness" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "natureOfBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_addressId_key" ON "companies"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "documents_name_companyId_key" ON "documents"("name", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "config_key_key" ON "config"("key");

-- CreateIndex
CREATE UNIQUE INDEX "shareholders_email_companyId_key" ON "shareholders"("email", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "shareholderInvites_email_companyId_key" ON "shareholderInvites"("email", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "directors_email_companyId_key" ON "directors"("email", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "directorInvites_email_companyId_key" ON "directorInvites"("email", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "companySecretaries_companyId_key" ON "companySecretaries"("companyId");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_presentorReferenceId_fkey" FOREIGN KEY ("presentorReferenceId") REFERENCES "presentorReferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shareCapital" ADD CONSTRAINT "shareCapital_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shareholders" ADD CONSTRAINT "shareholders_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directors" ADD CONSTRAINT "directors_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companySecretaries" ADD CONSTRAINT "companySecretaries_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
