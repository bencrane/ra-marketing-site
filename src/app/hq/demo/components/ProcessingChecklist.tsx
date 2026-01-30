"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ProcessingChecklistProps {
  steps: string[]
  completedSteps: number[]
  className?: string
}

export function ProcessingChecklist({
  steps,
  completedSteps,
  className = "",
}: ProcessingChecklistProps) {
  return (
    <Card className={className}>
      <CardContent className="p-5">
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div
              key={step}
              className={`flex items-center gap-3 transition-all duration-300 ${
                completedSteps.includes(i)
                  ? "opacity-100"
                  : completedSteps.length === i
                  ? "opacity-100"
                  : "opacity-40"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                  completedSteps.includes(i)
                    ? "bg-primary text-primary-foreground"
                    : "border border-border"
                }`}
              >
                {completedSteps.includes(i) ? (
                  <Check className="h-3 w-3" />
                ) : completedSteps.length === i ? (
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                ) : null}
              </div>
              <span
                className={`text-sm transition-colors duration-300 ${
                  completedSteps.includes(i) ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper hook for processing animation
export function useProcessingSteps(steps: string[], delayMs: number = 1000) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isDone, setIsDone] = useState(false)

  const startProcessing = async () => {
    setIsProcessing(true)
    setCompletedSteps([])
    setIsDone(false)

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      setCompletedSteps((prev) => [...prev, i])
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsDone(true)
  }

  const reset = () => {
    setIsProcessing(false)
    setCompletedSteps([])
    setIsDone(false)
  }

  return { isProcessing, completedSteps, isDone, startProcessing, reset }
}
