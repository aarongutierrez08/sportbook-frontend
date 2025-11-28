import React, { useState, useEffect, useRef } from "react";
import "../../styles/PlayerSelector.css";
import { searchUsers } from "../../api/userApi";
import type { Player, SportUser } from "../../types/apiTypes";

interface PlayerSelectorProps {
  selectedPlayers: Player[];
  onChange: (players: Player[]) => void;
  label: string;
  placeholder?: string;
  allowGuests?: boolean;
  // Nueva prop opcional
  excludePlayers?: Player[];
}

export const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  selectedPlayers,
  onChange,
  label,
  placeholder = "Buscar jugadores por username...",
  allowGuests = true,
  excludePlayers = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SportUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const users = await searchUsers(searchTerm);

        // Filtramos usuarios que ya están seleccionados en ESTE selector
        // Y TAMBIÉN los que están en la lista de excluidos (el otro equipo)
        const filtered = users.filter((user) => {
          const inCurrentList = selectedPlayers.some(
            (player) => player.user?.username === user.username
          );
          const inExcludedList = excludePlayers.some(
            (player) => player.user?.username === user.username
          );
          return !inCurrentList && !inExcludedList;
        });

        setSearchResults(filtered);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error buscando usuarios:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm, selectedPlayers, excludePlayers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddPlayer = (sportUser: SportUser) => {
    // Doble chequeo por seguridad al hacer click
    const exists =
      selectedPlayers.some((p) => p.user?.username === sportUser.username) ||
      excludePlayers.some((p) => p.user?.username === sportUser.username);

    if (!exists) {
      const newPlayer: Player = {
        id: sportUser.id,
        name: `${sportUser.name} ${sportUser.lastName}`,
        user: sportUser,
      };
      onChange([...selectedPlayers, newPlayer]);
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleAddGuest = () => {
    const trimmedName = searchTerm.trim();
    const existsInCurrent = selectedPlayers.some((p) => p.name === trimmedName);
    const existsInExcluded = excludePlayers.some((p) => p.name === trimmedName);

    if (trimmedName.length >= 2 && !existsInCurrent && !existsInExcluded) {
      const newGuest: Player = { name: trimmedName, id: 0 };
      onChange([...selectedPlayers, newGuest]);
      setSearchTerm("");
      setShowDropdown(false);
    } else if (existsInExcluded) {
      // Opcional: Mostrar feedback visual o toast de que ya está en el otro equipo
      console.warn("El jugador ya está en el otro equipo");
    }
  };

  const handleRemovePlayer = (playerToRemove: Player) => {
    onChange(selectedPlayers.filter((p) => p !== playerToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || searchTerm.trim().length < 2) return;

    e.preventDefault();
    if (searchResults.length === 0 && allowGuests && !isSearching) {
      handleAddGuest();
    } else if (searchResults.length === 1) {
      handleAddPlayer(searchResults[0]);
    }
  };

  return (
    <div className="player-selector">
      <label className="player-selector-label">{label}</label>

      {selectedPlayers.length > 0 && (
        <div className="selected-players">
          {selectedPlayers.map((player) => {
            const isGuest = !player.user;
            return (
              <div
                key={player.user?.username ?? player.name}
                className={`player-tag ${isGuest ? "guest" : ""}`}
              >
                <span className="player-tag-icon">{isGuest ? "👥" : "👤"}</span>
                <span className="player-tag-name">{player.name}</span>
                <button
                  type="button"
                  className="player-tag-remove"
                  onClick={() => handleRemovePlayer(player)}
                  aria-label={`Eliminar ${player.name}`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="player-search-container" ref={dropdownRef}>
        <input
          type="text"
          className="player-search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchResults.length > 0) setShowDropdown(true);
          }}
        />

        {isSearching && (
          <div className="player-search-loading">
            <span className="loading-spinner"></span>
          </div>
        )}

        {searchTerm.length > 0 && searchTerm.length < 2 && !isSearching && (
          <div className="player-search-dropdown">
            <div className="player-search-hint">
              ℹ️ Escribe al menos 2 caracteres para buscar
            </div>
          </div>
        )}

        {showDropdown && (
          <div className="player-search-dropdown">
            {searchResults.length > 0 &&
              searchResults.map((user) => (
                <button
                  key={user.username}
                  type="button"
                  className="player-search-result"
                  onClick={() => handleAddPlayer(user)}
                >
                  <div className="player-result-icon">👤</div>
                  <div className="player-result-info">
                    <div className="player-result-username">
                      @{user.username}
                    </div>
                    <div className="player-result-fullname">
                      {user.name} {user.lastName}
                    </div>
                  </div>
                </button>
              ))}

            {allowGuests && searchTerm.trim().length >= 2 && (
              <button
                type="button"
                className="player-search-result guest-option"
                onClick={handleAddGuest}
              >
                <div className="player-result-icon">👥</div>
                <div className="player-result-info">
                  <div className="player-result-username">
                    Agregar "{searchTerm.trim()}" como invitado
                  </div>
                  <div className="player-result-fullname">
                    Usuario no registrado
                  </div>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
