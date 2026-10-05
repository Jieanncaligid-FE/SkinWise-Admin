export interface UserAnalysisFactor {
	name: string;
	level: string;
	description: string;
}

export interface UserSkinAnalysis {
	skinType: string;
	skinTypeDescription: string;
	primaryConcerns: string[];
	summary: string;
	recommendedFocus: string[];
	factors: UserAnalysisFactor[];
}

export interface User {
	id: string;
	name: string;
	email: string;
	hasAnalysis: boolean;
	gender?: string;
	ageRange?: string;
	joinedAt?: string;
	analysis?: UserSkinAnalysis | null;
}