"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RoadmapDisplay } from "@/components/RoadmapDisplay";
import { fetchAPI } from "@/lib/api";
import { LogOut, History, Sparkles, Send } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const [goal, setGoal] = useState("");
    const [duration, setDuration] = useState("4");
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            loadHistory();
        }
    }, [router]);

    const loadHistory = async () => {
        try {
            const data = await fetchAPI("/roadmap/history");
            setHistory(data);
        } catch (err) {
            console.error("Failed to load history", err);
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal) return;

        setLoading(true);
        setRoadmap(null);

        try {
            const data = await fetchAPI("/roadmap/generate", {
                method: "POST",
                body: JSON.stringify({
                    goal,
                    duration_weeks: parseInt(duration),
                }),
            });
            setRoadmap({ ...data.roadmap_json, id: data.id });
            loadHistory(); // Refresh history
        } catch (err: any) {
            alert("Error generating roadmap: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    const handleToggleProgress = async (week: number, isCompleted: boolean) => {
        if (!roadmap || !roadmap.id) return;

        // Optimistic update
        const updatedWeeks = roadmap.weeks.map((w: any) =>
            w.week === week ? { ...w, isCompleted } : w
        );
        const updatedRoadmap = { ...roadmap, weeks: updatedWeeks };
        setRoadmap(updatedRoadmap);

        try {
            await fetchAPI(`/roadmap/${roadmap.id}/progress`, {
                method: "PATCH",
                body: JSON.stringify({ week_number: week, is_completed: isCompleted }),
            });
            // Update history list as well to reflect progress if we show it there, or just silence.
            loadHistory();
        } catch (error) {
            console.error("Failed to update progress", error);
            // Optionally revert here
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-zinc-900 border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    AI Roadmap Gen
                </h1>
                <div className="flex items-center gap-4">
                    {roadmap && roadmap.id && (
                        <Link href={`/roadmap/${roadmap.id}`}>
                            <Button variant="ghost" size="sm">Roadmap</Button>
                        </Link>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
                        <History className="w-4 h-4 mr-2" />
                        {showHistory ? "Hide History" : "History"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </header>

            <div className="flex-1 container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">

                {/* Sidebar History (Mobile hidden or conditional) */}
                {showHistory && (
                    <aside className="w-full md:w-64 shrink-0 space-y-4 animate-in slide-in-from-left duration-300">
                        <h3 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2">Past Roadmaps</h3>
                        <div className="space-y-2">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setRoadmap({ ...item.roadmap_json, id: item.id })}
                                    className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors text-sm"
                                >
                                    <div className="font-medium truncate">{item.goal}</div>
                                    <div className="text-xs text-muted-foreground">{item.duration_weeks} Weeks • {new Date(item.created_at).toLocaleDateString()}</div>
                                </div>
                            ))}
                            {history.length === 0 && <p className="text-sm text-muted-foreground">No history yet.</p>}
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <main className="flex-1 max-w-4xl mx-auto w-full space-y-8">

                    {/* Input Section */}
                    <section className="space-y-4">
                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-3xl font-bold tracking-tight">What do you want to learn?</h2>
                            <p className="text-muted-foreground">Describe your goal and let AI build your syllabus.</p>
                        </div>

                        <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-lg">
                            <CardContent className="p-6">
                                <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="e.g. Learn Python for Data Science, Master Guitar Basics..."
                                                value={goal}
                                                onChange={(e) => setGoal(e.target.value)}
                                                className="text-lg h-12"
                                                required
                                            />
                                        </div>
                                        <div className="w-full md:w-32">
                                            <select
                                                className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                            >
                                                <option value="2">2 Weeks</option>
                                                <option value="4">4 Weeks</option>
                                                <option value="8">8 Weeks</option>
                                                <option value="12">12 Weeks</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Button size="lg" className="w-full md:w-auto self-end px-8" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>Generating Syllabus...</>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" /> Generate Roadmap
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Roadmap Display */}
                    {roadmap && <RoadmapDisplay roadmap={roadmap} onToggleProgress={handleToggleProgress} />}

                </main>
            </div>
        </div>
    );
}
