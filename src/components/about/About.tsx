import { Heart, Music, Users, Sparkles } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-full bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Acerca de <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-600">SoulBeats</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Conectamos almas a través de la música. Descubre personas que comparten tus mismos gustos musicales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-fuchsia-100 dark:border-fuchsia-800">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-fuchsia-100 to-pink-100 dark:from-fuchsia-800 dark:to-pink-800 rounded-lg mb-4">
              <Music className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Música como Lenguaje</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Creemos que la música es el lenguaje universal que une a las personas más allá de las barreras.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-fuchsia-100 dark:border-fuchsia-800">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-fuchsia-100 to-pink-100 dark:from-fuchsia-800 dark:to-pink-800 rounded-lg mb-4">
              <Heart className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Conexiones Auténticas</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Facilitamos encuentros genuinos basados en afinidades musicales reales y gustos compartidos.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-fuchsia-100 dark:border-fuchsia-800">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-fuchsia-100 to-pink-100 dark:from-fuchsia-800 dark:to-pink-800 rounded-lg mb-4">
              <Users className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Comunidad Musical</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Construimos una comunidad donde los melómanos pueden encontrar su tribu musical perfecta.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-fuchsia-100 dark:border-fuchsia-800">
          <div className="text-center">
            <Sparkles className="w-12 h-12 text-fuchsia-600 dark:text-fuchsia-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Nuestra Visión</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
              En SoulBeats, imaginamos un mundo donde cada persona puede encontrar a alguien especial que 
              comparta su pasión por la música. Ya sea que ames el indie rock, la música electrónica, 
              el reggaeton o la música clásica, aquí encontrarás tu alma gemela musical.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}