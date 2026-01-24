"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Circle, Trophy } from "lucide-react";
import Link from "next/link";

export default function AnimatedRoadmapPage() {
    const [started, setStarted] = useState(false);
    const [activeStep, setActiveStep] = useState(-1);

    const steps = [
        {
            title: "Foundations",
            desc: "Learn the basics of syntax, variables, and control flow.",
            icon: <Circle className="w-6 h-6" />,
        },
        {
            title: "Data Structures",
            desc: "Master arrays, objects, trees, and graphs.",
            icon: <Circle className="w-6 h-6" />,
        },
        {
            title: "Algorithms",
            desc: "Sorting, searching, and optimization techniques.",
            icon: <Circle className="w-6 h-6" />,
        },
        {
            title: "Frameworks",
            desc: "React, Vue, or Angular for frontend dominance.",
            icon: <Circle className="w-6 h-6" />,
        },
        {
            title: "Backend API",
            desc: "Build robust APIs with Node.js, Python, or Go.",
            icon: <Circle className="w-6 h-6" />,
        },
        {
            title: "Deployment",
            desc: "Ship your code to the world with CI/CD.",
            icon: <Trophy className="w-6 h-6 text-yellow-500" />,
        },
    ];

    useEffect(() => {
        if (started) {
            let current = 0;
            const interval = setInterval(() => {
                if (current >= steps.length) {
                    clearInterval(interval);
                } else {
                    setActiveStep(current);
                    current++;
                }
            }, 800); // Animate one step every 800ms
            return () => clearInterval(interval);
        }
    }, [started, steps.length]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center py-20 px-4">
            <div className="fixed top-6 left-6 z-10">
                <Link href="/">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </Link>
            </div>

            <div className="text-center mb-16 space-y-4 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Your Learning Journey
                </h1>
                <p className="text-lg text-muted-foreground">
                    Visualize your path to mastery. Click start to see how your roadmap unfolds week by week.
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
                        Start Journey
                    </Button>
                )}
            </div>

            <div className="relative max-w-3xl w-full">
                {/* Center Line */}
                <div
                    className="absolute left-1/2 top-4 bottom-0 w-1 bg-gray-200 dark:bg-zinc-800 -translate-x-1/2 rounded-full overflow-hidden"
                    style={{ height: "calc(100% - 2rem)" }}
                >
                    <div
                        className="w-full bg-blue-500 transition-all duration-700 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        style={{
                            height: started ? `${((activeStep + 1) / steps.length) * 100}%` : "0%",
                        }}
                    />
                </div>

                <div className="space-y-12 relative">
                    {steps.map((step, idx) => {
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
                                        <div
                                            className={`p-6 bg-white dark:bg-zinc-900 rounded-2xl border shadow-lg transform transition-all duration-500 ${isCurrent ? "scale-105 border-blue-500 ring-2 ring-blue-500/20" : "hover:scale-105"
                                                }`}
                                        >
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                {step.desc}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Node */}
                                <div className="relative z-10 flex flex-col items-center justify-center w-14">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isActive
                                                ? "bg-blue-600 border-blue-100 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-110"
                                                : "bg-gray-100 border-gray-200 text-gray-400 dark:bg-zinc-800 dark:border-zinc-700"
                                            }`}
                                    >
                                        {isActive ? (
                                            <CheckCircle className="w-6 h-6 w-stroke-3 animate-in zoom-in spin-in-180 duration-500" />
                                        ) : (
                                            step.icon
                                        )}
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div className={`w-5/12 flex justify-start ${!isLeft ? "text-left" : ""}`}>
                                    {!isLeft && (
                                        <div
                                            className={`p-6 bg-white dark:bg-zinc-900 rounded-2xl border shadow-lg transform transition-all duration-500 ${isCurrent ? "scale-105 border-blue-500 ring-2 ring-blue-500/20" : "hover:scale-105"
                                                }`}
                                        >
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                {step.desc}
                                            </p>
                                        </div>
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
