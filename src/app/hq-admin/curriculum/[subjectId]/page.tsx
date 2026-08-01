import { notFound } from "next/navigation";
import { getSubjectById, getTerms, getNotesForSubject, getQuestions, getTopics, getQuizSets, getLecturesForSubject } from "@/actions/curriculum";
import SubjectDetailClient from "./SubjectDetailClient";

export default async function SubjectDetailPage({ params }: { params: Promise<{ subjectId: string }> }) {
    const { subjectId } = await params;
    const [subject, terms, notes, questions, topics, quizSets, lectures] = await Promise.all([
        getSubjectById(subjectId),
        getTerms(),
        getNotesForSubject(subjectId),
        getQuestions(subjectId),
        getTopics(subjectId),
        getQuizSets(subjectId),
        getLecturesForSubject(subjectId)
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
            lectures={lectures}
        />
    );
}
