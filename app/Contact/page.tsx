'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import FormControl from "../../components/Formcontrol";
import Modal from '@/components/Modal';
import Hero from '@/components/Hero';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      message: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
     
      (document.getElementById('contact_modal') as HTMLDialogElement).showModal();
     
    }
  };

  return (
    <main className='pt-4'>
      <Hero
        backgroundImage="/assets/cons.png"
        title="Contactez-Nous"
        description="Formation, conseils professionnels et opportunités d'emploi pour construire la carrière de vos rêves."
        backHref="/"
      />

      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="bg-blue-800 border border-zinc-800 rounded-2xl p-8">
          <p className="font-serif text-xs uppercase tracking-widest text-white font-bold mb-4">
            Nous contacter
          </p>
          <h2 className="font-black text-white leading-tight mb-6">
            Parlons de<br /><em className="not-italic">votre avenir</em>
          </h2>
          <p className="text-white/65 leading-loose mb-12 text-base">
            Notre équipe est à votre écoute pour toute question sur les admissions,
            les formations, les partenariats ou les événements.
          </p>
          <div className="flex flex-col gap-5">
            {[
              ["📍", "12 Avenue de l'Indépendance, Ouagadougou"],
              ["📞", "+226 25 30 00 00"],
              ["✉️", "contact@eduBlog.bf"],
              ["🕗", "Lun–Ven : 08h00 – 17h00"],
            ].map(([icon, text]) => (
              <div key={text as string} className="flex items-start gap-4">
                <span className="text-lg mt-0.5">{icon}</span>
                <span className="text-white text-sm leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-screen flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow space-y-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Contactez-nous</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormControl label="Nom et Prénom" error={errors.name}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  placeholder="Entrer votre nom complet"
                />
              </FormControl>

              <FormControl label="Adresse Email" error={errors.email}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  placeholder="Entrer votre email"
                />
              </FormControl>
            </div>

            <FormControl label="Message" error={errors.message}>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition resize-none"
                placeholder="Votre message ici..."
              />
            </FormControl>

            <Button type="submit">Envoyer</Button>
          </form>
        </div>
      </div>

      
      <Modal
        id="contact_modal"
        title="Message envoyé !"
        trigger=""  
      >
        <div className="text-center">
          <p className="text-lg">Votre message a bien été envoyé.</p>
          <p className="text-sm text-gray-500 mt-2">
            Nous vous répondrons dans les plus brefs délais.
          </p>
        </div>
      </Modal>
    </main>
  );
}