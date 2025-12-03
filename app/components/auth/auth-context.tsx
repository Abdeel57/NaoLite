setCurrentUser(updatedUser)
localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        }
    }

return (
    <AuthContext.Provider value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        signup,
        selectPlan,
        markTutorialComplete
    }}>
        {children}
    </AuthContext.Provider>
)
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
