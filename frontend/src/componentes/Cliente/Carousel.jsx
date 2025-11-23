export default function Carousel() {
  return (
    <div className="container-fluid my-4 p-0">
      <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <picture>
              <source media="(max-width: 1024px)" srcSet="/img/eco.png" />
              <img src="/img/eco.png" className="d-block w-100" alt="Promo 1" />
            </picture>
          </div>
          <div className="carousel-item">
            <picture>
              <source media="(max-width: 1024px)" srcSet="/img/eco2.png" />
              <img src="/img/eco2.png" className="d-block w-100" alt="Promo 2" />
            </picture>
          </div>
          <div className="carousel-item">
            <picture>
              <source media="(max-width: 1024px)" srcSet="/img/eco3.png" />
              <img src="/img/eco3.png" className="d-block w-100" alt="Promo 3" />
            </picture>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  )
}