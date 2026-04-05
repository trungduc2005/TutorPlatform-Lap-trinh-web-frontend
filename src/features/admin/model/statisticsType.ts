export type StatisticsItemType = {
  id: number;
  label: string;
  totalClasses: number;
  totalRevenue: number;
};

export type UnregisteredClassType = {
  id: number;
  subjectId: number;
  subjectName: string;
  gradeId: number;
  gradeCode: string;
  gradeName: string;
  locationId: number;
  locationName: string;
  locationCity: string;
  durationId: number;
  durationName: string;
  durationMinutes: number;
  fee: number;
  requirements: string;
  note: string;
  studentGender: string;
  studentDescription: string;
  createdById: number;
  createdByName: string;
};

export type SearchClassType = {
  items: UnregisteredClassType[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export type FilterOptionType = {
  id: number;
  name: string;
}
