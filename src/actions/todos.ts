"use server";

import { getAuthUser, getUserSupabase, recordTomatoEvent } from "./farm";

export async function getTodosAction(dateStr: string) {
    const user = await getAuthUser();
    const supabase = await getUserSupabase();

    const { data: todos, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", dateStr)
        .order("time", { ascending: true });

    if (error) {
        console.error("Error fetching todos:", error);
        return [];
    }
    
    return todos;
}

export async function addTodoAction(data: {
    title: string;
    subject: string;
    time: string;
    date: string;
}) {
    const user = await getAuthUser();
    const supabase = await getUserSupabase();

    const { data: newTodo, error } = await supabase
        .from("todos")
        .insert({
            user_id: user.id,
            title: data.title,
            subject: data.subject,
            time: data.time,
            date: data.date,
            completed: false
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding todo:", error);
        throw error;
    }

    return newTodo;
}

export async function toggleTodoAction(id: string, completed: boolean) {
    // Note: The 'completed' argument is ignored if we are moving from true to false
    // because of the "no undo" rule.
    const user = await getAuthUser();
    const supabase = await getUserSupabase();

    // 1. Fetch current task state
    const { data: task, error: fetchError } = await supabase
        .from("todos")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (fetchError || !task) {
        console.error("Task not found or unauthorized:", fetchError);
        throw new Error("Task not found");
    }

    // 2. No undo rule: If already completed, do nothing
    if (task.completed) {
        return { success: false, message: "Task is already completed and cannot be undone." };
    }

    // 3. Rate limiting (2-minute snooze)
    const { data: profile } = await supabase
        .from("user_profiles")
        .select("last_task_completed_at")
        .eq("id", user.id)
        .single();

    const now = new Date();
    if (profile?.last_task_completed_at) {
        const lastCompleted = new Date(profile.last_task_completed_at);
        const diffMinutes = (now.getTime() - lastCompleted.getTime()) / (1000 * 60);

        if (diffMinutes < 2) {
            const waitSeconds = Math.ceil((2 - diffMinutes) * 60);
            throw new Error(`Snooze time! Please wait ${waitSeconds} more seconds before completing another task.`);
        }
    }

    // 4. Perform the update
    const { error: updateError } = await supabase
        .from("todos")
        .update({ completed: true })
        .eq("id", id)
        .eq("user_id", user.id);

    if (updateError) {
        console.error("Error updating todo:", updateError);
        throw updateError;
    }

    // 5. Update last_task_completed_at in profile
    await supabase
        .from("user_profiles")
        .update({ last_task_completed_at: now.toISOString() })
        .eq("id", user.id);

    // 6. Award Tomatoes (e.g., 2 tomatoes per task)
    await recordTomatoEvent({
        actionType: "task_complete",
        description: `Completed task: ${task.title}`,
        tomatoes: 2,
    });

    return { success: true };
}

export async function deleteTodoAction(id: string) {
    const user = await getAuthUser();
    const supabase = await getUserSupabase();

    const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting todo:", error);
        throw error;
    }
}
