// HelloWorld.jsx
export default function HelloWorld() {
  const pubgPlayers = [
    {
      nama: "DmgeVERSE",
      nim: "999999",
      tanggal: "2025-01-01",
      level: "99",
      senjata: "AWM",
      foto: "img/nesa12.jpg",
      kill: 999,
      win: 99,
      rank: "Conqueror"
    },
    {
      nama: "NichtVERSE",
      nim: "169412",
      tanggal: new Date().toLocaleDateString(),
      level: "50",
      senjata: "M416",
      foto: "img/nesa3.jpg",
      kill: 569,
      win: 45,
      rank: "Ace"
    }
  ];

  return (
    <div className="container">
      {/* Header yang Rapi */}
      <header className="header">
        <div className="header-top">
          <h1>PUBG MOBILE</h1>
          <GreetingBinjai />
        </div>
        
        <div className="header-middle">
          <p className="subtitle">
            <span className="subtitle-icon">🎮</span>
            Selamat Datang di Erangel
            <span className="subtitle-icon">🎮</span>
          </p>
        </div>

        {/* Profile Section Terpisah */}
        <div className="leader-profile">
          <div className="leader-card">
            <img src="img/neshut.jpg" alt="Neshut" className="leader-image" />
            <div className="leader-info">
              <span className="leader-label">SQUAD LEADER</span>
              <h2 className="leader-name">CalyztaVERSE</h2>
              <div className="leader-stats">
                <span>🏆 1,234</span>
                <span>⚔️ 5,678</span>
                <span>⭐ Conqueror</span>
              </div>
            </div>
            <div className="leader-status">ONLINE</div>
          </div>
        </div>
      </header>

      {/* Card Grid */}
      <div className="card-grid">
        {pubgPlayers.map((player, index) => (
          <UserCard key={index} {...player} />
        ))}
      </div>

      <QuoteText />
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button>
          JOIN MATCH
        </button>
      </div>
    </div>
  );
}

function QuoteText() {
  const pubgQuotes = [
    "Winner Winner Chicken Dinner!",
    "Aku ingin jadi Macan Erangel"
  ];
  
  return (
    <div className="quote-section">
      <hr />
      <p className="quote italic">"{pubgQuotes[0].toLowerCase()}"</p>
      <p className="quote bold">{pubgQuotes[1].toUpperCase()}</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '2rem' }}>🪂</span>
        <span style={{ fontSize: '2rem' }}>🔫</span>
        <span style={{ fontSize: '2rem' }}>🚗</span>
      </div>
    </div>
  );
}

function GreetingBinjai() {
  return <div className="squad-badge">PUBG BINJAI SQUAD 🪂</div>;
}

function UserCard(props) {
  return (
    <div className="user-card">
      <div className={`rank-badge ${props.rank?.toLowerCase() || 'bronze'}`}>
        {props.rank || 'Bronze'}
      </div>
      
      <div className="profile-photo">
        <img src={props.foto} alt={props.nama} />
        <div className="photo-frame"></div>
        <div className="level-badge">LV.{props.level}</div>
      </div>
      
      <h3>{props.nama}</h3>
      
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-icon">🎯</span>
          <span className="stat-label">NIM</span>
          <span className="stat-value">{props.nim}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-icon">📅</span>
          <span className="stat-label">Join</span>
          <span className="stat-value">{props.tanggal}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-icon">⚔️</span>
          <span className="stat-label">Kill</span>
          <span className="stat-value">{props.kill || '0'}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-icon">🏆</span>
          <span className="stat-label">Win</span>
          <span className="stat-value">{props.win || '0'}</span>
        </div>
      </div>
      
      <div className="weapon-section">
        <span className="weapon-label">Favorite Weapon</span>
        <div className="weapon-display">
          <span className="weapon-icon">🔫</span>
          <span className="weapon-name">{props.senjata}</span>
        </div>
      </div>
      
      <div className="equipment">
        <span className="equipment-item" title="First Aid">💊</span>
        <span className="equipment-item" title="Helmet">🪖</span>
        <span className="equipment-item" title="Vest">🧥</span>
        <span className="equipment-item" title="Grenade">💣</span>
        <span className="equipment-item" title="Pan">🍳</span>
      </div>
    </div>
  );
}