import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/component/ui/Card"
import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"
import { Clock, BookOpen, BarChart, Users } from "lucide-react"
import Link from "next/link"

export default function CourseCard({
    id,
    title,
    category,
    duration = "6 weeks",
    level = "Intermediate",
    students = 1234,
    rating = 4.7,
    noOfModule,
    buttonLabel = "Learn More", 
    buttonLink = `/course/${id}`, 
  }) {
    return (
        <Card className="bg-gray-800 border-gray-700 overflow-hidden flex flex-col">
            <CardHeader className="border-b border-gray-700 pb-4">
                <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
                <p className="text-gray-500">{category}</p>
                <Badge variant="secondary" className="mt-2">
                    {level}
                </Badge>
            </CardHeader>
            <CardContent className="pt-4 flex-grow">
                <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-400">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{duration}</span>
                </div>
                <div className="flex items-center text-gray-400">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center text-gray-400">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{noOfModule} modules</span>
                </div>
                <div className="flex items-center text-gray-400">
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>{rating} rating</span>
                </div>
                </div>
            </CardContent>
            <CardFooter className="bg-gray-750 border-t border-gray-700 mt-auto">
                <Link href={buttonLink} passHref>
                    <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        {buttonLabel}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}