"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, BookOpen, Code } from "lucide-react";

// Minimal Badge replacement if not exists, or I can use standard Tailwind
function SimpleBadge({ children }: { children: React.ReactNode }) {
    return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium dark:bg-blue-900 dark:text-blue-100">{children}</span>;
}

interface Week {
    week: number;
    title: string;
    objectives: string[];
    topics: string[];
    resources: string[] | { name: string; url: string }[];
    mini_project: string;
    isCompleted?: boolean;
}

interface RoadmapJSON {
    id?: string; // We need ID for linking
    title: string;
    total_weeks: number;
    weeks: Week[];
}

interface RoadmapDisplayProps {
    roadmap: RoadmapJSON;
    onToggleProgress?: (week: number, isCompleted: boolean) => void;
}

export function RoadmapDisplay({ roadmap, onToggleProgress }: RoadmapDisplayProps) {
    if (!roadmap || !roadmap.weeks) return null;

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    {roadmap.title || "Your Learning Roadmap"}
                </h2>
                {roadmap.id && (
                    <div className="flex justify-center mt-4">
                        <a href={`/roadmap/${roadmap.id}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            Visualize Journey
                        </a>
                    </div>
                )}
                <div className="flex justify-center items-center gap-2 text-muted-foreground mt-2">
                    <span>{roadmap.total_weeks} Weeks to Mastery</span>
                    <span>•</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${(roadmap.weeks.filter(w => w.isCompleted).length / roadmap.total_weeks) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs">{Math.round((roadmap.weeks.filter(w => w.isCompleted).length / roadmap.total_weeks) * 100)}%</span>
                </div>
            </div>

            <div className="space-y-6">
                {roadmap.weeks.map((week, idx) => (
                    <Card key={idx} className={`border-l-4 transition-all duration-300 ${week.isCompleted ? 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20' : 'border-l-blue-500 hover:shadow-md'}`}>
                        <CardHeader className="bg-muted/30 pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-bold uppercase tracking-widest ${week.isCompleted ? 'text-green-600' : 'text-blue-500'}`}>Week {week.week}</span>
                                        {week.isCompleted && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Completed</span>}
                                    </div>
                                    <CardTitle className="text-xl mt-1">{week.title}</CardTitle>
                                </div>
                                {onToggleProgress && (
                                    <div className="flex items-center gap-2">
                                        <label htmlFor={`week-${week.week}`} className="text-sm text-muted-foreground cursor-pointer select-none">Mark Complete</label>
                                        <input
                                            type="checkbox"
                                            id={`week-${week.week}`}
                                            checked={!!week.isCompleted}
                                            onChange={(e) => onToggleProgress(week.week, e.target.checked)}
                                            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 grid md:grid-cols-2 gap-6">

                            {/* Left Column: Objectives & Topics */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-sm text-muted-foreground mb-3">
                                        <CheckCircle2 className="w-4 h-4" /> Objectives
                                    </h4>
                                    <ul className="space-y-2">
                                        {week.objectives.map((obj, i) => (
                                            <li key={i} className="text-sm flex items-start gap-2">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                                {obj}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-sm text-muted-foreground mb-3">
                                        <BookOpen className="w-4 h-4" /> Key Topics
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {week.topics.map((topic, i) => (
                                            <SimpleBadge key={i}>{topic}</SimpleBadge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Resources & Project */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-sm text-muted-foreground mb-3">
                                        <Code className="w-4 h-4" /> Mini Project
                                    </h4>
                                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                            {week.mini_project}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-3">Resources</h4>
                                    <ul className="space-y-1">
                                        {week.resources.map((res: any, i) => (
                                            <li key={i}>
                                                <a
                                                    href={typeof res === 'string' ? '#' : res.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm text-blue-600 hover:underline truncate block"
                                                >
                                                    {typeof res === 'string' ? res : res.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
