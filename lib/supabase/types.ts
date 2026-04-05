export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: "admin" | "lab" | "clinic"
          created_at: string
        }
      }
      labs: {
        Row: {
          id: string
          user_id: string
          name: string
          address: string
          phone: string
          representative: string
          created_at: string
        }
      }
      clinics: {
        Row: {
          id: string
          user_id: string
          name: string
          address: string
          phone: string
          doctor_name: string
          email: string
          created_at: string
        }
      }
      cases: {
        Row: {
          id: string
          lab_id: string
          clinic_id: string
          patient_name: string
          gender: string
          age: string
          reception_date: string
          delivery_date: string
          prosthesis_types: string[]
          shade: string
          metal_ag: boolean
          metal_pd: boolean
          opposing_teeth: string
          bite: string
          notes: string
          status: "진행중" | "완성" | "배송중" | "완료"
          photos: string[]
          created_at: string
          updated_at: string
        }
      }
      documents: {
        Row: {
          id: string
          lab_id: string
          clinic_id: string
          case_id: string
          type: "납품서" | "청구서" | "영수증"
          filename: string
          url: string
          generated_at: string
          created_at: string
        }
      }
      price_masters: {
        Row: {
          id: string
          lab_id: string
          clinic_id: string
          prices: Record<string, number>
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
