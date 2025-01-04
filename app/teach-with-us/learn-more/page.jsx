import Image from "next/image"
import { Button } from "@/component/ui/Button"
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import teachWithUs from '/public/teacher.jpg';
import launchCourse from '/public/launch-course.jpg';
import planCourse from '/public/plan-course.jpg';
import recordVideo from '/public/record-video.jpg';
import Link from "next/link";
import teacherApplication from "@/models/teacherApplication";


export default async function LandingPage() {
  // Fetch the user's session on the server
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id

  const teacherData = await teacherApplication.findOne({ userId: userId });
  if (teacherData?.status === 'Approved') {
    redirect('/instructor/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col items-center md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Come teach with us</h1>
            <p className="text-xl mb-6 text-gray-400">Become an instructor and change lives — including your own</p>
            <Link href={'/teach-with-us/get-started'}>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg">
                    Get Started
                </Button>
            </Link>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <Image
            src={teachWithUs}
            alt="Smiling instructor"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>
      </section>

      {/* Reasons to Start Section */}
      <section className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">So many reasons to start</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Teach your way", "Inspire learners", "Get rewarded"].map((reason, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-700 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Image src="/placeholder.svg?height=40&width=40" alt={reason} width={40} height={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{reason}</h3>
                <p className="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-purple-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-around text-center">
            {[
              { value: "73M", label: "Students" },
              { value: "75+", label: "Languages" },
              { value: "1B", label: "Enrollments" },
              { value: "180+", label: "Countries" },
              { value: "16,000+", label: "Enterprise customers" },
            ].map((stat, index) => (
              <div key={index} className="w-1/2 md:w-auto mb-8 md:mb-0">
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Begin Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How to begin</h2>
        <Tabs defaultValue="record" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 py-2 bg-slate-200 text-black">
            <TabsTrigger value="plan" className='border-r-2 border-x-sky-900'>Plan your curriculum</TabsTrigger>
            <TabsTrigger value="record" className='border-r-2 border-x-sky-900'>Record your video</TabsTrigger>
            <TabsTrigger value="launch">Launch your course</TabsTrigger>
          </TabsList>
          <TabsContent value="plan">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-semibold mb-4">Plan your curriculum</h3>
                <p className="text-gray-400 mb-4">
                  Start with your passion and knowledge. Then choose a promising topic with the help of our Marketplace Insights tool.
                </p>
                <p className="text-gray-400 mb-4">
                  The way that you teach — what you bring to it — is up to you.
                </p>
                <h4 className="text-xl font-semibold mb-2">How we help you</h4>
                <p className="text-gray-400">
                  We offer plenty of resources on how to create your first course. And, our instructor dashboard and curriculum pages help keep you organized.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <Image
                  src={planCourse}
                  alt="Planning curriculum"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="record">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-semibold mb-4">Record your video</h3>
                <p className="text-gray-400 mb-4">
                  Use basic tools like a smartphone or a DSLR camera. Add a good microphone and you're ready to start.
                </p>
                <p className="text-gray-400 mb-4">
                  If you don't like being on camera, just capture your screen. Either way, we recommend two hours or more of video for a paid course.
                </p>
                <h4 className="text-xl font-semibold mb-2">How we help you</h4>
                <p className="text-gray-400">
                  Our support team is available to help you throughout the process and provide feedback on test videos.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <Image
                  src={recordVideo}
                  alt="Recording video"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="launch">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-semibold mb-4">Launch your course</h3>
                <p className="text-gray-400 mb-4">
                  Gather your first ratings and reviews by promoting your course through your network and social media.
                </p>
                <p className="text-gray-400 mb-4">
                  Your course will be discoverable in our marketplace where you can continue to market it to our global audience.
                </p>
                <h4 className="text-xl font-semibold mb-2">How we help you</h4>
                <p className="text-gray-400">
                  We guide you through course quality standards and connect you to resources to help you succeed.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <Image
                  src={launchCourse}
                  alt="Launching course"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}