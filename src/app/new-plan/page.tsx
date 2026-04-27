'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import StepIndicator from '@/components/new-plan/StepIndicator';
import Step1BasicInfo from '@/components/new-plan/Step1BasicInfo';
import Step2AcademicBackground from '@/components/new-plan/Step2AcademicBackground';
import Step3InterestsExperience from '@/components/new-plan/Step3InterestsExperience';
import Step4ProfessionalDirection from '@/components/new-plan/Step4ProfessionalDirection';
import { StudentStorage, PlanStorage } from '@/lib/storage';
import type { Student } from '@/types';

export default function NewPlanPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Student>>({
    favoriteSubjects: [],
    majors: ['', ''],
    targetCountries: [],
  });

  const updateFormData = (updates: Partial<Student>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const student = StudentStorage.create(formData as Omit<Student, 'id' | 'createdAt' | 'updatedAt'>);
      const plan = PlanStorage.create(student.id);
      router.push(`/plans/${plan.id}/pt-pg`);
    } catch (e) {
      console.error('Failed to create student/plan:', e);
    }
  };

  return (
    <div className="p-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft size={16} />
        返回工作台
      </Link>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">新建活动规划方案</h1>
          <p className="text-gray-500 text-sm mt-1">填写学生信息，AI 将生成个性化的活动方案</p>
        </div>

        <StepIndicator currentStep={currentStep} />

        {currentStep === 1 && (
          <Step1BasicInfo data={formData} onChange={updateFormData} onNext={handleNext} />
        )}
        {currentStep === 2 && (
          <Step2AcademicBackground data={formData} onChange={updateFormData} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 3 && (
          <Step3InterestsExperience data={formData} onChange={updateFormData} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 4 && (
          <Step4ProfessionalDirection data={formData} onChange={updateFormData} onBack={handleBack} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}
