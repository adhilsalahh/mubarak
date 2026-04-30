const KitchenRangeCard = ({ range }) => {
  return (
    <div className="range-card">
      <img src={range.image} alt={range.name} />
      <h3>{range.name}</h3>
      <p>{range.description}</p>
      <a href="#details">{range.details}</a>
    </div>
  );
};

export default KitchenRangeCard;