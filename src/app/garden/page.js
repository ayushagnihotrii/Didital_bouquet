'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getGarden, deleteBouquetFromGarden, toggleFavorite, isFavorite } from '@/lib/storage';
import { flowers as flowerData, occasions } from '@/lib/flowers';
import BouquetRenderer from '@/components/BouquetRenderer';

export default function GardenPage() {
  const [garden, setGarden] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [filter, setFilter] = useState('all'); // all, favorites
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadGarden();
  }, []);

  const loadGarden = () => {
    const items = getGarden();
    setGarden(items);
    const favMap = {};
    items.forEach(item => {
      favMap[item.id] = isFavorite(item.id);
    });
    setFavorites(favMap);
  };

  const handleToggleFavorite = (id) => {
    const newState = toggleFavorite(id);
    setFavorites(prev => ({ ...prev, [id]: newState }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this bouquet from your garden?')) {
      deleteBouquetFromGarden(id);
      loadGarden();
    }
  };

  const getShareUrl = (encoded) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/bouquet?d=${encoded}`;
  };

  const filtered = filter === 'favorites'
    ? garden.filter(b => favorites[b.id])
    : garden;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="py-6 text-center border-b border-gray-100">
        <Link href="/" className="font-script text-3xl text-charcoal hover:text-bloom-rose transition-colors">
          Digibouquet
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-center text-lg tracking-[0.2em] mb-2">OUR GARDEN</h1>
        <p className="text-center text-charcoal/60 text-sm mb-8">
          {garden.length > 0
            ? 'Thanks for stopping by! Here are your created bouquets.'
            : 'Your garden is empty. Create your first bouquet!'}
        </p>

        {/* Filter tabs */}
        {garden.length > 0 && (
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`font-display text-xs tracking-widest px-4 py-2 rounded-full transition-all ${
                filter === 'all'
                  ? 'bg-charcoal text-white'
                  : 'bg-white text-charcoal hover:bg-gray-100'
              }`}
            >
              ALL ({garden.length})
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`font-display text-xs tracking-widest px-4 py-2 rounded-full transition-all ${
                filter === 'favorites'
                  ? 'bg-bloom-rose text-white'
                  : 'bg-white text-charcoal hover:bg-gray-100'
              }`}
            >
              ❤️ FAVORITES ({garden.filter(b => favorites[b.id]).length})
            </button>
          </div>
        )}

        {/* Bouquet Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((bouquet, index) => {
              const occasionData = occasions.find(o => o.id === bouquet.occasion);
              return (
                <div
                  key={bouquet.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards', opacity: 0 }}
                >
                  {/* Bouquet preview */}
                  <div className="p-4 flex justify-center bg-gray-50/50">
                    <BouquetRenderer
                      selectedFlowerIds={bouquet.flowers || []}
                      vaseId={bouquet.vase || 'modern'}
                      size={180}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    {/* Occasion tag */}
                    {occasionData && (
                      <span className="inline-block px-3 py-1 bg-bloom-rose/10 text-bloom-rose rounded-full text-xs font-display tracking-wider">
                        {occasionData.emoji} {occasionData.label}
                      </span>
                    )}

                    {/* Card preview */}
                    {bouquet.card && (
                      <div className="text-sm">
                        <p className="font-mono text-xs text-charcoal/70 line-clamp-2">
                          &ldquo;{bouquet.card.message}&rdquo;
                        </p>
                        <p className="text-xs text-charcoal/40 mt-1">
                          To: {bouquet.card.recipientName || 'Friend'} • From: {bouquet.card.senderName || 'Anonymous'}
                        </p>
                      </div>
                    )}

                    {/* Flower tags */}
                    <div className="flex flex-wrap gap-1">
                      {(bouquet.flowers || []).slice(0, 5).map(fId => {
                        const flower = flowerData.find(f => f.id === fId);
                        return flower ? (
                          <span key={fId} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-charcoal/60">
                            {flower.name}
                          </span>
                        ) : null;
                      })}
                      {(bouquet.flowers || []).length > 5 && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-charcoal/40">
                          +{bouquet.flowers.length - 5} more
                        </span>
                      )}
                    </div>

                    {/* Date */}
                    <p className="text-xs text-charcoal/30">
                      Created {new Date(bouquet.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleFavorite(bouquet.id)}
                          className="text-lg hover:scale-125 transition-transform"
                          title={favorites[bouquet.id] ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {favorites[bouquet.id] ? '❤️' : '🤍'}
                        </button>
                        <button
                          onClick={() => handleDelete(bouquet.id)}
                          className="text-lg hover:scale-125 transition-transform opacity-40 hover:opacity-100"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="flex gap-2">
                        {bouquet.encoded && (
                          <button
                            onClick={() => {
                              const url = getShareUrl(bouquet.encoded);
                              navigator.clipboard.writeText(url).then(() => {
                                alert('Link copied!');
                              });
                            }}
                            className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            📋 Copy Link
                          </button>
                        )}
                        {bouquet.encoded && (
                          <Link
                            href={`/bouquet?d=${bouquet.encoded}`}
                            className="text-xs px-3 py-1 bg-bloom-rose text-white rounded-full hover:bg-bloom-rose/80 transition-colors"
                          >
                            👁️ View
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6 animate-float">🌱</div>
            <p className="text-charcoal/60 mb-8">
              {filter === 'favorites'
                ? 'No favorites yet. Heart a bouquet to save it!'
                : 'No bouquets yet. Plant your first one!'}
            </p>
            <Link href="/build" className="btn-primary">
              BUILD A BOUQUET
            </Link>
          </div>
        )}
      </div>

      {/* Back to home */}
      <div className="text-center py-8">
        <Link href="/" className="btn-ghost">
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
