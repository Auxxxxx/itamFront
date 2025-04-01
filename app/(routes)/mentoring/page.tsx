import Link from 'next/link'

export default function MentoringPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Менторство</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Найти ментора</h2>
          <p className="text-gray-600 mb-4">
            Найдите ментора, который поможет вам развить необходимые навыки и достичь ваших целей.
          </p>
          <Link 
            href="/mentoring/find-mentor" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Посмотреть менторов
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Стать ментором</h2>
          <p className="text-gray-600 mb-4">
            Делитесь своими знаниями и опытом, помогайте другим расти и развиваться.
          </p>
          <Link 
            href="/mentoring/become-mentor" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Создать профиль ментора
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
        <h2 className="text-xl font-semibold mb-4">Мои менторские сессии</h2>
        <p className="text-gray-600 mb-4">
          Управляйте своими запланированными сессиями с менторами или вашими менти.
        </p>
        <Link 
          href="/mentoring/sessions" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Просмотреть сессии
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Как это работает</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
            <div>
              <h3 className="font-medium">Найдите подходящего ментора</h3>
              <p className="text-gray-600">Просмотрите профили менторов и выберите того, кто соответствует вашим целям и интересам.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">2</div>
            <div>
              <h3 className="font-medium">Забронируйте время</h3>
              <p className="text-gray-600">Выберите удобное время для звонка или чата из доступных слотов ментора.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">3</div>
            <div>
              <h3 className="font-medium">Проведите сессию</h3>
              <p className="text-gray-600">Получите ценные знания и обратную связь во время менторской сессии.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 