import { useState } from 'react';
import type { Recipe } from '../types/recipe';
import { chatAboutRecipe } from '../services/aiClient';
import { Button } from './Button';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

export function RecipeChat({ recipe }: { recipe: Recipe }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [allowWebSearch, setAllowWebSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function send(text = message) {
    if (!text.trim()) return;
    const userMessage: Message = { role: 'user', text: text.trim() };
    setMessages((current) => [...current, userMessage]);
    setMessage('');
    try {
      setLoading(true);
      setError('');
      const response = await chatAboutRecipe(recipe, userMessage.text, allowWebSearch);
      setMessages((current) => [...current, { role: 'assistant', text: response.answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Le chat IA n'est pas disponible.");
    } finally {
      setLoading(false);
    }
  }

  const suggestions = ['Par quoi remplacer la creme ?', 'Adapter pour 6 personnes', 'Variante plus legere', 'Quel accompagnement ?'];

  return (
    <section className="rounded-[30px] border border-white/70 bg-white/45 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-serif text-2xl font-semibold text-ink">Question cuisine</h3>
          <p className="text-sm text-ink/60">Reponses courtes, pratiques, en francais.</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input type="checkbox" checked={allowWebSearch} onChange={(event) => setAllowWebSearch(event.target.checked)} className="h-5 w-5 accent-terracotta" />
          Web si disponible
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <button key={item} onClick={() => send(item)} className="rounded-full bg-cream/80 px-3 py-2 text-xs font-semibold text-moss ring-1 ring-sage/20">
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">
        {messages.map((item, index) => (
          <div key={index} className={`rounded-3xl px-4 py-3 text-sm leading-6 ${item.role === 'user' ? 'ml-8 bg-ink text-cream' : 'mr-8 bg-cream text-ink'}`}>
            {item.text}
          </div>
        ))}
      </div>
      <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => { event.preventDefault(); send(); }}>
        <input value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-11 flex-1 rounded-full border border-ink/10 bg-cream/80 px-4 py-2 outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20" placeholder="Posez une question sur cette recette" />
        <Button disabled={loading}>{loading ? '...' : 'Envoyer'}</Button>
      </form>
      {error && <p className="mt-3 text-sm font-semibold text-terracotta">{error}</p>}
    </section>
  );
}
