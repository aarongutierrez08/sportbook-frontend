import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Tabs, Tab } from "@mui/material";
import toast from "react-hot-toast";
import { FootballProfileForm } from "../commons/components/sports/FootballProfileForm";
import { VolleyProfileForm } from "../commons/components/sports/VolleyProfileForm";
import { PaddleProfileForm } from "../commons/components/sports/PaddleProfileForm";
import {
  fetchProfiles,
  updateFootballProfile,
  updatePaddleProfile,
  updateVolleyProfile,
} from "../api/profileApi";
import "../styles/profile-page.css";
import type {
  FootballProfileDetail,
  PaddleProfileDetail,
  SportProfile,
  VolleyProfileDetail,
} from "../types/apiTypes";

const ProfilePage: React.FC = () => {
  const [tab, setTab] = React.useState<"football" | "volley" | "paddle">(
    "football"
  );

  const footballForm = useForm<FootballProfileDetail>({
    defaultValues: {
      sport: "FOOTBALL",
      positions: [],
      favoritePosition: "ST",
      ability: 5,
      playsOften: "often",
    },
  });

  const volleyForm = useForm<VolleyProfileDetail>({
    defaultValues: {
      sport: "VOLLEY",
      positions: [],
      favoritePosition: "Setter",
      ability: 5,
      blockHeight: undefined,
      offensiveLevel: 5,
      defensiveLevel: 5,
      serveType: "",
      playsOften: "often",
    },
  });

  const paddleForm = useForm<PaddleProfileDetail>({
    defaultValues: {
      sport: "PADDLE",
      preferredSide: "DRIVE",
      ability: 5,
      playStyle: "MIXTO",
      playedTournaments: false,
      playsOften: "often",
    },
  });

  useEffect(() => {
    fetchProfiles().then((profiles: SportProfile[]) => {
      const football = profiles.find((profile) => profile.sport === "FOOTBALL");
      if (football)
        footballForm.reset(football.details as FootballProfileDetail);

      const volley = profiles.find((profile) => profile.sport === "VOLLEY");
      if (volley) volleyForm.reset(volley.details as VolleyProfileDetail);

      const paddle = profiles.find((profile) => profile.sport === "PADDLE");
      if (paddle) paddleForm.reset(paddle.details as PaddleProfileDetail);
    });
  }, [footballForm, volleyForm, paddleForm]);

  const handleSubmit = async (
    data: FootballProfileDetail | VolleyProfileDetail | PaddleProfileDetail
  ) => {
    if (tab === "football") {
      toast.promise(updateFootballProfile(data as FootballProfileDetail), {
        loading: "Guardando perfil de fútbol...",
        success: "Perfil de fútbol actualizado",
        error: "Error al guardar fútbol",
      });
    } else if (tab === "volley") {
      toast.promise(updateVolleyProfile(data as VolleyProfileDetail), {
        loading: "Guardando perfil de vóley...",
        success: "Perfil de vóley actualizado",
        error: "Error al guardar vóley",
      });
    } else if (tab === "paddle") {
      toast.promise(updatePaddleProfile(data as PaddleProfileDetail), {
        loading: "Guardando perfil de pádel...",
        success: "Perfil de pádel actualizado",
        error: "Error al guardar pádel",
      });
    }
  };

  const currentMethods: any =
    tab === "football"
      ? footballForm
      : tab === "volley"
      ? volleyForm
      : paddleForm;

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

            <div className="buttons-container form-full">
              <button type="submit" className="btn btn--lg">
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
