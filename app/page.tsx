import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ИТ-Платформа</h1>
          <p className="text-xl text-gray-600">
            Участвуйте в инновационных хакатонах, мероприятиях, курсах и программах менторства
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link 
            href="/hackathons" 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-4">Хакатоны</h2>
            <p className="mb-6">
              Просматривайте доступные хакатоны, регистрируйтесь и присоединяйтесь к командам.
            </p>
            <div className="text-blue-600 font-medium">Подробнее →</div>
          </Link>

          <Link 
            href="/events" 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-4">Мероприятия</h2>
            <p className="mb-6">
              Узнайте о предстоящих мероприятиях в сфере ИТ и технологий.
            </p>
            <div className="text-blue-600 font-medium">Подробнее →</div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Link 
            href="/courses" 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-4">Курсы</h2>
            <p className="mb-6">
              Изучайте новые технологии и развивайте навыки с помощью наших курсов.
            </p>
            <div className="text-blue-600 font-medium">Подробнее →</div>
          </Link>

          <Link 
            href="/mentoring" 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-4">Менторство</h2>
            <p className="mb-6">
              Получите поддержку опытных менторов в вашем профессиональном развитии.
            </p>
            <div className="text-blue-600 font-medium">Подробнее →</div>
          </Link>

          <Link 
            href="/profiles" 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-4">Профили</h2>
            <p className="mb-6">
              Просматривайте профили участников и создавайте свой профессиональный профиль.
            </p>
            <div className="text-blue-600 font-medium">Подробнее →</div>
          </Link>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">О нашей платформе</h2>
          <p className="mb-4">
            Наша ИТ-платформа предоставляет возможность участвовать в различных образовательных и технологических мероприятиях, 
            находить единомышленников и развивать свои профессиональные навыки.
          </p>
          <p>
            Регистрируйтесь сейчас, чтобы получить доступ ко всем сервисам!
          </p>
        </div>
      </div>
    </div>
  )
} 