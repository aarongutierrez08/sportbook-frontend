import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Tabs, Tab } from "@mui/material";
import toast from "react-hot-toast";
import { FootballProfileForm } from "../components/sports/FootballProfileForm";
import { VolleyProfileForm } from "../components/sports/VolleyProfileForm";
import { PaddleProfileForm } from "../components/sports/PaddleProfileForm";
import {
  fetchProfiles,
  updateFootballProfile,
  updatePaddleProfile,
  updateVolleyProfile,
} from "../api/profileApi";
import type {
  FootballProfileDTO,
  VolleyProfileDTO,
  SportProfileDTO,
  PaddleProfileDTO,
} from "../types/user";
import "../styles/profile-page.css"

const ProfilePage: React.FC = () => {
  const [tab, setTab] = React.useState<"football" | "volley" | "paddle">("football");

  const footballForm = useForm<FootballProfileDTO>({
    defaultValues: {
      sport: "FOOTBALL",
      positions: [],
      favoritePosition: "ST",
      ability: 5,
      playsOften: false,
    },
  });

  const volleyForm = useForm<VolleyProfileDTO>({
    defaultValues: {
      sport: "VOLLEY",
      positions: [],
      favoritePosition: "Setter",
      ability: 5,
      playsOften: false,
      blockHeight: undefined,
      rolePreference: "OFENSIVO",
    },
  });

  const paddleForm = useForm<PaddleProfileDTO>({
    defaultValues: {
      sport: "PADDLE",
      preferredSide: "DRIVE",
      ability: 5,
      playsOften: false,
      playStyle: "MIXTO",
      playedTournaments: false,
    },
  });

  useEffect(() => {
    fetchProfiles().then((profiles: SportProfileDTO[]) => {
      const football = profiles.find((p) => p.sport === "FOOTBALL");
      if (football) footballForm.reset(football.details as FootballProfileDTO);

      const volley = profiles.find((p) => p.sport === "VOLLEY");
      if (volley) volleyForm.reset(volley.details as VolleyProfileDTO);

      const paddle = profiles.find((p) => p.sport === "PADDLE");
      if (paddle) paddleForm.reset(paddle.details as PaddleProfileDTO);
    });
  }, [footballForm, volleyForm, paddleForm]);

  const handleSubmit = async (
    data: FootballProfileDTO | VolleyProfileDTO | PaddleProfileDTO
  ) => {
    if (tab === "football") {
      toast.promise(updateFootballProfile(data as FootballProfileDTO), {
        loading: "Guardando perfil de fútbol...",
        success: "Perfil de fútbol actualizado",
        error: "Error al guardar fútbol",
      });
    } else if (tab === "volley") {
      toast.promise(updateVolleyProfile(data as VolleyProfileDTO), {
        loading: "Guardando perfil de vóley...",
        success: "Perfil de vóley actualizado",
        error: "Error al guardar vóley",
      });
    } else if (tab === "paddle") {
      toast.promise(updatePaddleProfile(data as PaddleProfileDTO), {
        loading: "Guardando perfil de pádel...",
        success: "Perfil de pádel actualizado",
        error: "Error al guardar pádel",
      });
    }
  };

  const currentMethods: any =
    tab === "football" ? footballForm : tab === "volley" ? volleyForm : paddleForm;

    return (
      <div className="container">
        <div className="profile-card">
          <div className="profile-header">
            <h2 className="page-title">Configurar perfil</h2>
          </div>
    
          <div className="profile-tabs">
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Fútbol" value="football" />
              <Tab label="Vóley" value="volley" />
              <Tab label="Pádel" value="paddle" />
            </Tabs>
          </div>
    
          <FormProvider {...currentMethods}>
            <form
              onSubmit={currentMethods.handleSubmit(handleSubmit)}
              className="profile-form"
            >
              {tab === "football" && <FootballProfileForm />}
              {tab === "volley" && <VolleyProfileForm />}
              {tab === "paddle" && <PaddleProfileForm />}
    
              <div className="profile-submit">
                <button type="submit" className="btn">
                  Guardar cambios
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    );
    
};

export default ProfilePage;
