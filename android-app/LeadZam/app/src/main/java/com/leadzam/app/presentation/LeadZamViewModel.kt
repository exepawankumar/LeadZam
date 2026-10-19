package com.leadzam.app.presentation


import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class LeadZamViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(
        LeadZamUiState()
    )

    val uiState = _uiState.asStateFlow()
}