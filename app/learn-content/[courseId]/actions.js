// app/learn-content/[courseId]/actions.js

'use server';

import UserCourseProgress from '@/models/UserCourseProgress';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongodb';

export async function markLessonCompleted({ courseId, sectionTitle, lectureTitle }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error('Unauthorized');
    }

    await connectToDB();

    const progressDoc = await UserCourseProgress.findOne({
        user: session.user.id,
        course: courseId,
    });

    if (!progressDoc) {
        throw new Error('Progress record not found');
    }

    const section = progressDoc.progress.curriculum.find(
        (sec) => sec.sectionTitle === sectionTitle
    );

    if (!section) {
        throw new Error('Section not found');
    }

    const lecture = section.lectures.find((lec) => lec.title === lectureTitle);

    if (!lecture) {
        throw new Error('Lecture not found');
    }

    lecture.completed = true;

    // Recalculate the completion percentage
    const totalLectures = progressDoc.progress.curriculum.reduce(
        (total, sec) => total + sec.lectures.length,
        0
    );
    const completedLectures = progressDoc.progress.curriculum.reduce(
        (total, sec) => total + sec.lectures.filter((lec) => lec.completed).length,
        0
    );

    progressDoc.progress.percentage =
        totalLectures === 0 ? 0 : (completedLectures / totalLectures) * 100;

    await progressDoc.save();

    // Convert the progress to a plain JavaScript object
    const plainProgress = progressDoc.progress.toObject({ depopulate: true });

    return plainProgress;
}
