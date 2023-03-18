// Copyright Epic Games, Inc. All Rights Reserved.

#include "IslandGameGameMode.h"
#include "IslandGameCharacter.h"
#include "UObject/ConstructorHelpers.h"

AIslandGameGameMode::AIslandGameGameMode()
{
	// set default pawn class to our Blueprinted character
	static ConstructorHelpers::FClassFinder<APawn> PlayerPawnBPClass(TEXT("/Game/ThirdPersonCPP/Blueprints/ThirdPersonCharacter"));
	if (PlayerPawnBPClass.Class != NULL)
	{
		DefaultPawnClass = PlayerPawnBPClass.Class;
	}
}
