import '../../assets/styles/blog.css'

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'Reutilización de Ropa: Cómo ayudamos al planeta',
      summary: 'Descubre cómo nuestras prendas reutilizadas contribuyen a un estilo de vida más ecológico y sostenible.',
      image: '/img/blog1.jpg',
      date: '15 Ene 2025',
    },
    {
      id: 2,
      title: '5 Consejos para una Moda Responsable',
      summary: 'Aprende cómo elegir prendas que cuiden el medio ambiente sin sacrificar estilo y comodidad.',
      image: '/img/blog2.jpg',
      date: '16 Ene 2025',
    },
  ]

  return (
    <div className="container my-5">
      <h2 className="mb-4">Blog - Noticias y novedades</h2>
      {posts.map((p) => (
        <div key={p.id} className="blog-noticia">
          <div className="blog-contenido">
            <h4 className="mb-1">{p.title}</h4>
            <small className="text-muted d-block mb-2">{p.date}</small>
            <p className="mb-3">{p.summary}</p>
            <button type="button" className="btn btn-ver-noticia">Ver noticia completa</button>
          </div>
          <img src={p.image} alt={p.title} />
        </div>
      ))}
    </div>
  )
}