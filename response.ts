export interface ApiResponse<T> {
  data: T;
}

export interface CourseCategoryResponse {
  id: string;
  name: string;
  slug: string;
}

export interface CourseModuleResponse {
  id: string;
  title: string;
  description: string;
}

export interface InstallmentResponse {
  id: string;
  planId: string;
  installmentNo: number;
  amount: string;
  dueAfterDays: number;
}

export interface InstallmentPlanResponse {
  id: string;
  courseId: string;
  isActive: boolean;
  discountPercent?: string;
  installments: InstallmentResponse[];
}

export interface CourseByIdResponse {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  originalPrice: string;
  bookingAmount: string | null;
  rating: number;
  technologyTags: string[];
  duration: string;
  status: string;
  courseImgUrl: string;
  portraitImgUrl: string | null;
  syllabus: string | null;
  courseCategorieId: string;
  isPlacementGurranted: boolean;
  isInSale: boolean;
  createdAt: string;
  updatedAt: string;
  courseCategorie: CourseCategoryResponse | null;
  modules: CourseModuleResponse[];
  courseModuleIds: string[];
  installmentPlans: InstallmentPlanResponse[];
}
