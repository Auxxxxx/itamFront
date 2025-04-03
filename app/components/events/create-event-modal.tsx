"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { toast } from "@/app/components/ui/use-toast"
import { createEvent, CreateEventRequest } from "@/app/lib/services/event-service"

interface CreateEventModalProps {
  onEventCreated: () => void;
}

export function CreateEventModal({ onEventCreated }: CreateEventModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateEventRequest>({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: 0,
    image_url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate the form data
      if (!formData.title.trim()) {
        throw new Error("Название мероприятия не может быть пустым")
      }
      
      if (!formData.description.trim()) {
        throw new Error("Описание мероприятия не может быть пустым")
      }
      
      if (!formData.date) {
        throw new Error("Необходимо указать дату проведения")
      }
      
      if (!formData.location.trim()) {
        throw new Error("Необходимо указать место проведения")
      }
      
      if (formData.capacity <= 0) {
        throw new Error("Вместимость должна быть больше 0")
      }

      const createdEvent = await createEvent(formData)
      toast({
        title: "Успешно",
        description: "Мероприятие успешно создано",
        variant: "default",
      })
      setOpen(false)
      onEventCreated()
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось создать мероприятие. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }))
  }

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      capacity: 0,
      image_url: "",
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Создать мероприятие
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать новое мероприятие</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название мероприятия</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введите название мероприятия"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишите ваше мероприятие"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Дата проведения</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Место проведения</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Укажите адрес или онлайн"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capacity">Вместимость (человек)</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Укажите количество участников"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image_url">URL изображения (необязательно)</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Создание..." : "Создать мероприятие"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 