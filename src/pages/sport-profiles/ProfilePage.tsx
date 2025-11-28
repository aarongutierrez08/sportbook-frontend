import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Tabs, Tab } from "@mui/material";
import toast from "react-hot-toast";
import { FootballProfileForm } from "../../commons/sports/FootballProfileForm";
import { VolleyProfileForm } from "../../commons/sports/VolleyProfileForm";
import { PaddleProfileForm } from "../../commons/sports/PaddleProfileForm";
import {
  fetchProfiles,
  updateFootballProfile,
  updatePaddleProfile,
  updateVolleyProfile,
} from "../../api/profileApi";
import "../../styles/profile-page.css";
import type {
  FootballProfileDetail,
  PaddleProfileDetail,
  SportProfile,
  VolleyProfileDetail,
} from "../../types/apiTypes";

const ProfilePage: React.FC = () => {
  const [tab, setTab] = React.useState<"football" | "volley" | "paddle">(
    "football"
  );

  // Formularios con valores por defecto seguros
  const footballForm = useForm<FootballProfileDetail>({
    defaultValues: {
      positions: [],
      favoritePosition: "ST",
      ability: 5,
      playsOften: "OFTEN", // String por defecto
    },
  });

  const volleyForm = useForm<VolleyProfileDetail>({
    defaultValues: {
      positions: [],
      favoritePosition: "Setter",
      ability: 5,
      blockHeight: undefined,
      rolePreference: "",
      serveType: "",
      playsOften: "OFTEN",
    },
  });

  const paddleForm = useForm<PaddleProfileDetail>({
    defaultValues: {
      preferredSide: "DRIVE",
      ability: 5,
      playStyle: "MIXTO",
      playedTournaments: false,
      playsOften: "OFTEN",
    },
  });

  // Cargar datos del backend al montar
  useEffect(() => {
    fetchProfiles()
      .then((profiles: SportProfile[]) => {
        const football = profiles.find((p) => p.sport === "FOOTBALL");
        if (football && football.details) {
          // Reseteamos el formulario con los datos que vienen del backend
          // Como el backend ya devuelve el detalle polimórfico correcto, lo casteamos.
          footballForm.reset(football.details as FootballProfileDetail);
        }

        const volley = profiles.find((p) => p.sport === "VOLLEY");
        if (volley && volley.details) {
          volleyForm.reset(volley.details as VolleyProfileDetail);
        }

        const paddle = profiles.find((p) => p.sport === "PADDLE");
        if (paddle && paddle.details) {
          paddleForm.reset(paddle.details as PaddleProfileDetail);
        }
      })
      .catch(() => {
        toast.error("No se pudieron cargar tus perfiles deportivos");
      });
  }, [footballForm, volleyForm, paddleForm]);

  const handleSubmit = async (
    data: FootballProfileDetail | VolleyProfileDetail | PaddleProfileDetail
  ) => {
    try {
      if (tab === "football") {
        await updateFootballProfile(data as FootballProfileDetail);
        toast.success("Perfil de fútbol actualizado");
      } else if (tab === "volley") {
        await updateVolleyProfile(data as VolleyProfileDetail);
        toast.success("Perfil de vóley actualizado");
      } else if (tab === "paddle") {
        await updatePaddleProfile(data as PaddleProfileDetail);
        toast.success("Perfil de pádel actualizado");
      }
    } catch {
      toast.error(`Error al guardar el perfil de ${tab}`);
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
