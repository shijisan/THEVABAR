import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    if (id) {
      const course = await prisma.course.findUnique({
        where: { id: parseInt(id) },
      });

      if (!course) {
        return new Response(JSON.stringify({ error: "Course not found" }), { status: 404 });
      }
      return new Response(JSON.stringify(course), { status: 200 });
    } else {
      const courses = await prisma.course.findMany();
      return new Response(JSON.stringify(courses), { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "An error occurred while fetching courses" }), { status: 500 });
  }
}
