import { notFound } from "next/navigation";
import { getSubjectById, getTerms, getNotesForSubject, getQuestions, getTopics, getQuizSets } from "@/actions/curriculum";
import SubjectDetailClient from "./SubjectDetailClient";

export default async function SubjectDetailPage({ params }: { params: Promise<{ subjectId: string }> }) {
    const { subjectId } = await params;
    const [subject, terms, notes, questions, topics, quizSets] = await Promise.all([
        getSubjectById(subjectId),
        getTerms(),
        getNotesForSubject(subjectId),
        getQuestions(subjectId),
        getTopics(subjectId),
        getQuizSets(subjectId)
    ]);

    if (!subject) notFound();

    const term = terms.find((t) => t.id === subject.term_id);

    return (
        <SubjectDetailClient
            subject={subject}
            termName={term?.name ?? "Unknown Term"}
            initialNotes={notes}
            initialQuestions={questions}
            topics={topics}
            initialQuizSets={quizSets}
        />
    );
}
