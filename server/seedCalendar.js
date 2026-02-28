import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CalendarEvent from './src/models/CalendarEvent.js';

dotenv.config();

const ADMIN_ID = '69a2f632376651625de1772a';

const events = [
    // Holidays
    { title: "New Year's Day", date: "2026-01-01", type: 'holiday' },
    { title: "Swamiji's Birthday", date: "2026-01-12", type: 'holiday' },
    { title: "Netaji Jayanti / Vasant Panchami", date: "2026-01-23", type: 'holiday' },
    { title: "Republic Day", date: "2026-01-26", type: 'holiday' },
    { title: "Shab-e-Barat", date: "2026-02-04", type: 'holiday' },
    { title: "Doljatra", date: "2026-03-03", type: 'holiday' },
    { title: "Holi", date: "2026-03-04", type: 'holiday' },
    { title: "Idul Fitr", date: "2026-03-21", type: 'holiday' },
    { title: "Ram Navami", date: "2026-03-26", type: 'holiday' },
    { title: "Mahavir Jayanti", date: "2026-03-31", type: 'holiday' },
    { title: "Good Friday", date: "2026-04-03", type: 'holiday' },
    { title: "Dr. Ambedkar's Birthday", date: "2026-04-14", type: 'holiday' },
    { title: "Bengali New Year", date: "2026-04-15", type: 'holiday' },
    { title: "May Day", date: "2026-05-01", type: 'holiday' },
    { title: "Rabindranath Jayanti", date: "2026-05-09", type: 'holiday' },
    { title: "Id-Ud-Zoha", date: "2026-05-27", type: 'holiday' },
    { title: "Muharram", date: "2026-06-26", type: 'holiday' },

    // Academic Schedule
    { title: "Class Commencement (6th & 8th Sem)", date: "2026-01-07", type: 'event' },
    { title: "Student Enrollment (Regular)", date: "2026-01-12", endDate: "2026-01-20", type: 'event' },
    { title: "CA1 Assessment (PPT & Quiz)", date: "2026-01-28", endDate: "2026-01-30", type: 'exam' },
    { title: "CA2 Assessment (Technical Report & Quiz)", date: "2026-02-22", endDate: "2026-02-25", type: 'exam' },
    { title: "CA4 Assessment (Online Exam)", date: "2026-05-05", endDate: "2026-05-10", type: 'exam' },
    { title: "PCA1 Practical Assessment", date: "2026-02-17", endDate: "2026-02-28", type: 'exam' },
    { title: "PCA2 Practical Assessment", date: "2026-04-22", endDate: "2026-05-03", type: 'exam' },

    // Attendance Deadlines
    { title: "Attendance Phase I Deadline", date: "2026-02-06", type: 'assignment_deadline' },
    { title: "Attendance Phase II Deadline", date: "2026-03-05", type: 'assignment_deadline' },
    { title: "Attendance Phase III Deadline", date: "2026-04-08", type: 'assignment_deadline' },
    { title: "Attendance Phase IV Deadline", date: "2026-04-30", type: 'assignment_deadline' },

    // Special Events
    { title: "International Women's Day", date: "2026-03-08", type: 'event' },
    { title: "Guardians Interaction (6th Sem)", date: "2026-03-28", type: 'event' },
    { title: "Earth Day", date: "2026-04-22", type: 'event' },
    { title: "World Environment Day", date: "2026-06-05", type: 'event' },
    { title: "Intl Day against Drug Abuse", date: "2026-06-26", type: 'event' },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing events (optional, maybe just holidays and events)
        await CalendarEvent.deleteMany({ type: { $in: ['holiday', 'event', 'exam', 'assignment_deadline'] } });
        console.log('Cleared existing academic events');

        const formattedEvents = events.map(event => ({
            ...event,
            date: new Date(event.date),
            endDate: event.endDate ? new Date(event.endDate) : undefined,
            createdBy: ADMIN_ID
        }));

        await CalendarEvent.insertMany(formattedEvents);
        console.log(`Inserted ${formattedEvents.length} calendar events`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding calendar:', error);
        process.exit(1);
    }
}

seed();
