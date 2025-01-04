import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/component/ui/Button'
import { Input } from '@/component/ui/Input'
import { BookOpen, Users, Award, Clock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden">
      {/* Gradient background */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 opacity-50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div> */}

      <main className="relative z-10">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to IntelliLearn Studios</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Unlock your potential with our expert-led online courses. Learn anytime, anywhere, at your own pace.</p>
          <Link href={'/register'}>
            <Button size="lg">Join Us Today!</Button>
          </Link>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose IntelliLearn Studios?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-gray-800 bg-opacity-50 p-6 rounded-lg">
                <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
                <p>Learn from industry professionals and subject matter experts.</p>
              </div>
              <div className="text-center bg-gray-800 bg-opacity-50 p-6 rounded-lg">
                <Clock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
                <p>Study at your own pace, anytime and anywhere.</p>
              </div>
              <div className="text-center bg-gray-800 bg-opacity-50 p-6 rounded-lg">
                <Award className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Certificates</h3>
                <p>Earn recognized certificates upon course completion.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="courses" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Popular Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Machine Learning Fundamentals", description: "Master the basics of ML algorithms and applications.",image: "/ML-course-image.jpg" },
                { title: "Web Development Bootcamp", description: "Build modern, responsive websites from scratch.",image: "/Web-dev-course-image.jpg"},
                { title: "Data Science for Beginners", description: "Learn to analyze and visualize complex datasets.",image: "/data-science-course-image.jpeg" }
              ].map((course, index) => (
                <div key={index} className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden shadow-lg">
                  <div className="relative w-full h-48">
                    <Image
                      src={course.image || "/default-course-image.jpg"}
                      alt={`${course.title} thumbnail`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6 flex-col justify-center text-center">
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <p className="mb-4">{course.description}</p>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">What Our Students Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: "Alex Johnson", course: "Marketing Fundamentals", text: "IntelliLearn Studios has been a game-changer for my career. The ML course was comprehensive and practical." },
                { name: "Samuel Lee", course: "Web Development Bootcamp", text: "I went from a complete beginner to building full-stack applications. The instructors are fantastic!" }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <p className="mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="relative w-12 h-12">
                      <Image
                        src={'/male-ai-face.jpeg'}
                        alt={`AI-agent-face`}
                        layout="fill"
                        objectFit="cover"
                        className='rounded-full'
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.course}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of students already learning on IntelliLearn Studios. Sign up now and get access to our wide range of courses.</p>
            <form className="max-w-md mx-auto flex gap-4">
              <Input type="email" placeholder="Enter your email" className="flex-grow" />
              <Link href='/register'>
                <Button type="submit">Sign Up</Button>
              </Link>
            </form>
          </div>
        </section>
      </main>

      <footer className="relative z-10 bg-gray-800 bg-opacity-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} IntelliLearn Studios. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}