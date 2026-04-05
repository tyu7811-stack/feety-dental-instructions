"use client"

import type { Case, ProsthesisType } from "./types"

// Simple in-memory store for demo purposes
// In production, this would be replaced with a database

let submittedOrders: Case[] = []
let orderCounter = 100 // Start from CASE-2026-0100

export function addSubmittedOrder(order: {
  patientName: string
  toothPositions: string[]
  prosthesisTypes: ProsthesisType[]
  shade: string
  metalType: string
  notes: string
  dueDate: string
}): Case {
  orderCounter++
  const newCase: Case = {
    id: `CASE-2026-${String(orderCounter).padStart(4, "0")}`,
    clinicId: "clinic-001",
    labId: "lab-001",
    patientName: order.patientName || "未入力",
    toothPositions: order.toothPositions.length > 0 ? order.toothPositions : ["未選択"],
    prosthesisTypes: order.prosthesisTypes.length > 0 ? order.prosthesisTypes : ["インレー"],
    shade: order.shade || "-",
    metalType: order.metalType || "-",
    notes: order.notes,
    status: "製作開始",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: order.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
  
  submittedOrders.unshift(newCase) // Add to beginning (most recent first)
  return newCase
}

export function getSubmittedOrders(): Case[] {
  return submittedOrders
}

export function clearSubmittedOrders(): void {
  submittedOrders = []
}
