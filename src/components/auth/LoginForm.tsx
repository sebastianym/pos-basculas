"use client";
import React, { useEffect, useState } from "react";
import { SubmitButton } from "@/components/custom/SubmitButton";
import { ZodErrors } from "@/components/custom/ZodErrors";
import { loginAction } from "@/data/actions/auth/loginAction";
import { useFormState } from "react-dom";
import { ApiErrors } from "../custom/ApiErrors";

const INITIAL_STATE = {
  apiErrors: null,
  zodErrors: null,
  data: null,
  message: null,
};

export default function LoginForm() {
  const [formState, formAction] = useFormState(loginAction, INITIAL_STATE);

  return (
    <div className="sm:p-20 sm:min-h-screen sm:flex sm:justify-center sm:items-center">
      <div className="w-full max-xl:w-full container">
        <div className="w-full flex flex-wrap bg-secondaryBg rounded-2xl sm:shadow-xl">
          <div className="hidden lg:block lg:w-1/2 lg:h-auto w-full h-52 relative lg:rounded-l-2xl max-lg:rounded-xl lg:order-1 order-1 max-lg:mt-5">
            <div
              className="absolute inset-0 lg:rounded-l-2xl brightness-[0.5] shadow-xl"
              style={{
                backgroundImage: "url('/assets/imageLogin.jfif')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          </div>
          <div className="lg:w-1/2 md:mt-5 xl:p-20 lg:!p-12 p-12 !pb-6 max-sm:p-14 rounded-r-2xl max-lg:rounded-xl lg:order-1 order-1">
            <div>
              <span className="bg-blue-500 px-3 rounded-sm text-sm py-1 text-white font-semibold">
                Software de basculas industriales
              </span>
              <h1 className="text-3xl  font-semibold xl:mb-5 w-full pt-5 ">
                Acceso al sistema
              </h1>
            </div>
            <p className="mb-8 text-bg-black max-xl:text-justify text-gray-600">
              A continuación ingresa los datos requeridos para acceder con tu
              perfil al sistema.
            </p>
            <form action={formAction}>
              <label htmlFor="identificador">
                <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2">
                  Identificador
                </p>
              </label>
              <input
                id="identificador"
                autoComplete="off"
                name="identificador"
                placeholder="Ingresa tu identificador aquí"
                className="w-full min-w-0 rounded-md  bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10 focus:border-pink-400 text-base leading-6 px-3 py-3"
              />
              <ZodErrors error={formState?.zodErrors?.identificador} />

              <label htmlFor="password">
                <p className="block text-sm font-semibold leading-[18px] text-gray-600 mb-2 mt-5">
                  Contraseña
                </p>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Ingresa tu contraseña aquí"
                className="w-full min-w-0 rounded-md  bg-transparent border border-gray-200 placeholder-gray-500 focus:outline-none relative z-10  focus:border-pink-400 text-base leading-6 px-3 py-3"
              />
              <ZodErrors error={formState?.zodErrors?.password} />

              <div className="flex flex-col mt-8">
                <SubmitButton
                  className="w-full "
                  text="Iniciar sesión"
                  loadingText="Cargando"
                  color="blue"
                  size="large"
                />
                <ApiErrors error={formState?.apiErrors} />
              </div>
            </form>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-600">
          <p>Creado por Sebastian Yepes M.</p>
          <p>Contacto: (+57) 305 763 5018</p>
        </div>
      </div>
    </div>
  );
}
