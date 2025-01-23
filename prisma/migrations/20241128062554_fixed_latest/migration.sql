-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "batch" TEXT NOT NULL,
    "fbAccountLink" TEXT NOT NULL,
    "proofOfPayment" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
