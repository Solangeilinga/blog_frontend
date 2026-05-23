import ArticleForm from '@/components/ArticleForm'
import React from 'react'
import Hero from '@/components/Hero'

const page = () => {
  return (
    <section className="min-h-screen bg-background font-body pt-16 pb-16">
        <Hero
  title="Créez votre propre article"
  description="Des cours adaptés à votre niveau."
  backgroundImage="/assets/hero.png"

/>
     <ArticleForm/> 
    </section>
  )
}

export default page
