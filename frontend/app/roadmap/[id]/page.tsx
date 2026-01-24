"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Circle, Trophy, Play, BookOpen, Code, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";

export default function DynamicRoadmapPage() {
    const params = useParams();
    const router = useRouter();
    const [roadmap, setRoadmap] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [started, setStarted] = useState(false);
    const [activeStep, setActiveStep] = useState(-1);

    useEffect(() => {
        if (params.id) {
            loadRoadmap(params.id as string);
        }
    }, [params.id]);

    const loadRoadmap = async (id: string) => {
        try {
            const data = await fetchAPI(`/roadmap/${id}`);
            setRoadmap(data.roadmap_json);
            // Auto-start or fast-forward to completed steps if we wanted
        } catch (err: any) {
            console.error("Failed to load roadmap", err);
            alert("Failed to load roadmap.");
            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (started && roadmap) {
            let current = 0;
            const interval = setInterval(() => {
                if (current >= roadmap.weeks.length) {
                    clearInterval(interval);
                } else {
                    setActiveStep(current);
                    current++;
                }
            }, 800); // 800ms per step
            return () => clearInterval(interval);
        }
    }, [started, roadmap]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (!roadmap) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center py-20 px-4">
            <div className="fixed top-6 left-6 z-10">
                <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            <div className="text-center mb-16 space-y-4 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    {roadmap.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                    {roadmap.total_weeks} Weeks to Mastery. Visualize your journey.
                </p>
                {!started && (
                    <Button
                        size="lg"
                        className="mt-8 text-lg px-12 animate-bounce"
                        onClick={() => {
                            setStarted(true);
                            setActiveStep(-1);
                        }}
                    >
                        <Play className="w-4 h-4 mr-2 fill-current" /> Start Visualization
                    </Button>
                )}
            </div>

            <div className="relative max-w-4xl w-full">
                {/* Center Line */}
                <div
                    className="absolute left-1/2 top-4 bottom-0 w-1 bg-gray-200 dark:bg-zinc-800 -translate-x-1/2 rounded-full overflow-hidden"
                    style={{ height: "calc(100% - 2rem)" }}
                >
                    <div
                        className="w-full bg-blue-500 transition-all duration-700 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        style={{
                            height: started ? `${((activeStep + 1) / roadmap.weeks.length) * 100}%` : "0%",
                        }}
                    />
                </div>

                <div className="space-y-16 relative">
                    {roadmap.weeks.map((week: any, idx: number) => {
                        const isActive = idx <= activeStep;
                        const isCurrent = idx === activeStep;
                        const isLeft = idx % 2 === 0;

                        return (
                            <div
                                key={idx}
                                className={`flex items-center justify-between w-full ${isActive ? "opacity-100" : "opacity-30 blur-[2px]"
                                    } transition-all duration-700`}
                            >
                                {/* Left Side */}
                                <div className={`w-5/12 flex justify-end ${isLeft ? "text-right" : ""}`}>
                                    {isLeft && (
                                        <RoadmapNodeContent week={week} isCurrent={isCurrent} />
                                    )}
                                </div>

                                {/* Node */}
                                <div className="relative z-10 flex flex-col items-center justify-center w-14">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isActive
                                                ? week.isCompleted
                                                    ? "bg-green-600 border-green-100 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-110"
                                                    : "bg-blue-600 border-blue-100 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-110"
                                                : "bg-gray-100 border-gray-200 text-gray-400 dark:bg-zinc-800 dark:border-zinc-700"
                                            }`}
                                    >
                                        {isActive && week.isCompleted ? (
                                            <CheckCircle className="w-6 h-6 w-stroke-3 animate-in zoom-in spin-in-180 duration-500" />
                                        ) : isActive ? (
                                            <span className="font-bold text-lg">{week.week}</span>
                                        ) : (
                                            <Circle className="w-6 h-6" />
                                        )}
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div className={`w-5/12 flex justify-start ${!isLeft ? "text-left" : ""}`}>
                                    {!isLeft && (
                                        <RoadmapNodeContent week={week} isCurrent={isCurrent} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function RoadmapNodeContent({ week, isCurrent }: { week: any, isCurrent: boolean }) {
    return (
        <div
            className={`p-6 bg-white dark:bg-zinc-900 rounded-2xl border shadow-lg transform transition-all duration-500 ${isCurrent ? "scale-105 border-blue-500 ring-2 ring-blue-500/20" : "hover:scale-105"
                }`}
        >
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1 block">Week {week.week}</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {week.title}
            </h3>

            <div className="space-y-3 mt-4">
                <div>
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                        <BookOpen className="w-3 h-3" /> Topics
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {week.topics.slice(0, 3).map((t: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded text-xs text-slate-600 dark:text-slate-300">
                                {t}
                            </span>
                        ))}
                        {week.topics.length > 3 && <span className="text-xs text-muted-foreground">+{week.topics.length - 3} more</span>}
                    </div>
                </div>

                <div>
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                        <Code className="w-3 h-3" /> Project
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-200 line-clamp-2">
                        {week.mini_project}
                    </p>
                </div>
            </div>
        </div>
    )
}
