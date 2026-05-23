"use client";
import { Send } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal"; 

const Newsletter = () => {
  const [formData, setFormData] = useState({
    email: '',
  });
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (document.getElementById('newsletter_modal') as HTMLDialogElement).showModal();
    setFormData({ email: '' });
  }

  return (
    <>
      <section className="bg-black py-16 text-white pb-24">
        <div className="container text-center">
          <h2 className="mb-3 font-display text-3xl font-bold text-primary-foreground">
            Restez informé
          </h2>
          <p className="mx-auto mb-8 max-w-md text-primary-foreground/70">
            Recevez nos meilleurs conseils carrière et formations directement dans votre boîte mail.
          </p>
          <form
            className="mx-auto flex max-w-md gap-2"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              name="email"
              required
              className="flex-1 rounded-lg border-0 bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 outline-none ring-1 ring-primary-foreground/20 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-blue-800 hover:bg-blue-900 px-6 py-3 text-sm font-semibold text-secondary-foreground transition-transform hover:scale-105"
            >
              <Send className="h-4 w-4" />
              S'abonner
            </button>
          </form>
        </div>
      </section>

     
      <Modal
        id="newsletter_modal"
        title="Inscription réussie !"
        trigger=""  
      >
        <div className="text-center">
          <p className="text-lg">
            Merci de vous être abonné avec l'email : 
            <br />
            <span className="font-bold text-blue-600">{formData.email}</span>
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Vous recevrez bientôt nos prochaines actualités !
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Newsletter;